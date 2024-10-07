import { supabase } from '@/lib/supabase'

// User functions
export async function createUser(data) {
  const { data: newUser, error } = await supabase
    .from('User')
    .insert([data])
    .select()
  if (error) throw error
  return newUser
}

export async function getUser(id) {
  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function updateUser(id, updates) {
  const { data, error } = await supabase
    .from('User')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data
}

// Investment functions
export async function createInvestment(data) {
  const { data: newInvestment, error } = await supabase
    .from('Investment')
    .insert([data])
    .select()
  if (error) throw error
  return newInvestment
}

export async function getInvestments(userId) {
  const { data, error } = await supabase
    .from('Investment')
    .select('*')
    .eq('userId', userId)
  if (error) throw error
  return data
}

// PendingRegistration functions
export async function createPendingRegistration(data) {
  const { data: newRegistration, error } = await supabase
    .from('PendingRegistration')
    .insert([data])
    .select()
  if (error) throw error
  return newRegistration
}

export async function getPendingRegistration(id) {
  const { data, error } = await supabase
    .from('PendingRegistration')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function updatePendingRegistration(id, updates) {
  const { data, error } = await supabase
    .from('PendingRegistration')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data
}

// Package functions
export async function getPackages() {
  const { data, error } = await supabase
    .from('Package')
    .select('*')
  if (error) throw error
  return data
}

export async function getPackage(id) {
  const { data, error } = await supabase
    .from('Package')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

// User count function
export async function getUserCount() {
  try {
    const { count, error } = await supabase
      .from('User')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    
    return count || 0
  } catch (error) {
    console.error('Error fetching user count:', error)
    return 0 // Return 0 instead of throwing an error
  }
}
