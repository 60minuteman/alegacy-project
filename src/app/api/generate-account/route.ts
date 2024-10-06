import { NextResponse } from 'next/server';
import { generateAccount } from '@/utils/payscribe';
import { supabase } from '@/types/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received data in generate-account API:', JSON.stringify(body, null, 2));

    const { first_name, last_name, email, phone, amount, selectedPackages } = body;

    if (!first_name || !last_name || !email || !phone || amount === undefined) {
      console.log('Missing required fields:', { first_name, last_name, email, phone, amount });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Calling generateAccount with:', JSON.stringify({ firstName: first_name, lastName: last_name, email, phone, amount }, null, 2));
    
    const accountDetails = await generateAccount({ 
      firstName: first_name, 
      lastName: last_name, 
      email, 
      phone, 
      amount: Number(amount) 
    });
    
    console.log('Account details generated:', JSON.stringify(accountDetails, null, 2));

    if (accountDetails.status) {
      const account = accountDetails.message.details.account[0];
      const expiryDate = new Date(accountDetails.message.details.expiry_date);

      // Check if a PendingRegistration already exists
      const { data: existingRegistration, error: fetchError } = await supabase
        .from('PendingRegistration')
        .select('*')
        .eq('email', email)
        .eq('totalAmount', parseFloat(amount))
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing registration:', fetchError);
        throw new Error(`Failed to check existing registration: ${fetchError.message}`);
      }

      let pendingRegistration;

      if (existingRegistration) {
        // Update existing registration
        const { data, error } = await supabase
          .from('PendingRegistration')
          .update({
            accountNumber: account.account_number,
            accountName: account.account_name,
            bank: account.bank_name,
            selectedPackages: selectedPackages,
            expiryDate: expiryDate.toISOString(),
            paymentStatus: 'PENDING',
            transId: accountDetails.message.details.ref,
            sessionId: accountDetails.message.details.ref
          })
          .eq('id', existingRegistration.id)
          .select()
          .single();

        if (error) {
          console.error('Supabase update error:', error);
          throw new Error(`Supabase update failed: ${error.message}`);
        }
        pendingRegistration = data;
      } else {
        // Insert new registration
        const { data, error } = await supabase
          .from('PendingRegistration')
          .insert([
            {
              firstName: first_name,
              lastName: last_name,
              email,
              phoneNumber: phone,
              totalAmount: parseFloat(amount),
              accountNumber: account.account_number,
              accountName: account.account_name,
              bank: account.bank_name,
              selectedPackages: selectedPackages,
              expiryDate: expiryDate.toISOString(),
              paymentStatus: 'PENDING',
              transId: accountDetails.message.details.ref,
              sessionId: accountDetails.message.details.ref
            }
          ])
          .select()
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          throw new Error(`Supabase insert failed: ${error.message}`);
        }
        pendingRegistration = data;
      }

      console.log('Data inserted/updated in Supabase:', pendingRegistration);

      // Construct the URL for the payment page
      const paymentUrl = `/payment?account_number=${account.account_number}&account_name=${encodeURIComponent(account.account_name)}&bank=${encodeURIComponent(account.bank_name)}&amount=${amount}&sessionId=${accountDetails.message.details.ref}`;

      // Return a response with the payment URL and the inserted/updated data
      return NextResponse.json({
        status: 'success',
        paymentUrl: paymentUrl,
        pendingRegistration: pendingRegistration
      });
    } else {
      return NextResponse.json({ error: 'Failed to generate account details' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in generate-account API route:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Non-Error object thrown:', JSON.stringify(error, null, 2));
    }
    return NextResponse.json({ 
      error: 'Failed to generate account', 
      details: error instanceof Error ? error.message : JSON.stringify(error)
    }, { status: 500 });
  }
}