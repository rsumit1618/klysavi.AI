export const isValidIndianMobileNumber = (value: string) => /^[6-9]\d{9}$/.test(value.replace(/\D/g, ''));

export const isValidPhoneNumber = (value: string) => {
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly.length >= 8 && digitsOnly.length <= 15;
};

export const isValidOtp = (value: string) => /^\d{6}$/.test(value.replace(/\D/g, ''));

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
