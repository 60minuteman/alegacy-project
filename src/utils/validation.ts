export function validateEmail(email: string): boolean {
  const result = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  console.log('Email validation:', email, result);
  return result;
}

export function validatePhone(phone: string): boolean {
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(phone);
}

export function validateName(name: string): boolean {
  return name.length >= 2 && name.length <= 50;
}

export function validateAmount(amount: number): boolean {
  return amount > 0 && amount <= 1000000; // Adjust max amount as needed
}
