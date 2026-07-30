import { useState } from 'react';
import { useRouter } from 'expo-router';

export const FINANCE_TYPES = [
  'Personal Finance',
  'Auto Finance',
  'Mortgage / Housing Finance',
  'Credit Card Limit',
];

export const INTEREST_RATES = ['4%', '5%', '6%', '7%', '8%'];

export function useFinancialCalculatorViewModel() {
  const router = useRouter();

  const [financeType, setFinanceType] = useState('Personal Finance');
  const [requestedAmount, setRequestedAmount] = useState('15,000');
  const [periodMonths, setPeriodMonths] = useState('48');
  const [interestRate, setInterestRate] = useState('6%');
  const [grossIncome, setGrossIncome] = useState('1,000');
  const [internalDeduction, setInternalDeduction] = useState('100');
  const [personalLoanDeduction, setPersonalLoanDeduction] = useState('50');
  const [creditCardLimit, setCreditCardLimit] = useState('700');
  const [autoLoanDeduction, setAutoLoanDeduction] = useState('40');
  const [housingLoanDeduction, setHousingLoanDeduction] = useState('180');

  const [activePicker, setActivePicker] = useState<'TYPE' | 'RATE' | null>(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');

  const parseVal = (str: string) => parseFloat(str.replace(/,/g, '')) || 0;

  const netDeductionVal =
    parseVal(internalDeduction) +
    parseVal(personalLoanDeduction) +
    parseVal(autoLoanDeduction) +
    parseVal(housingLoanDeduction);

  const netDeductionFormatted = `BHD ${netDeductionVal.toFixed(3)}`;

  const sanitizeNumber = (val: string) => val.replace(/\D/g, '');

  const handleCalculate = () => {
    const numReqAmount = parseVal(requestedAmount);
    const numMonths = parseInt(periodMonths, 10) || 0;
    const numIncome = parseVal(grossIncome);

    if (numReqAmount < 100) {
      setBannerMessage('Requested amount must be at least BHD 100.000');
      setBannerVisible(true);
      return;
    }

    if (numMonths < 6) {
      setBannerMessage('Tenure period must be at least 6 months');
      setBannerVisible(true);
      return;
    }

    if (numIncome < 100) {
      setBannerMessage('Gross income must be at least BHD 100.000');
      setBannerVisible(true);
      return;
    }

    router.push({
      pathname: '/financial-calculator-result',
      params: {
        financeType,
        requestedAmount: `BHD ${numReqAmount.toLocaleString()}`,
        periodMonths: `${numMonths} Months`,
        netDeduction: netDeductionFormatted,
      },
    });
  };

  return {
    financeType,
    setFinanceType,
    requestedAmount,
    setRequestedAmount: (val: string) => setRequestedAmount(sanitizeNumber(val)),
    periodMonths,
    setPeriodMonths: (val: string) => {
      const sanitized = sanitizeNumber(val);
      if (sanitized && parseInt(sanitized, 10) > 84) {
        setPeriodMonths('84');
        setBannerMessage('Maximum tenure period allowed is 84 months (7 years)');
        setBannerVisible(true);
      } else {
        setPeriodMonths(sanitized);
      }
    },
    interestRate,
    setInterestRate,
    grossIncome,
    setGrossIncome: (val: string) => setGrossIncome(sanitizeNumber(val)),
    internalDeduction,
    setInternalDeduction: (val: string) => setInternalDeduction(sanitizeNumber(val)),
    personalLoanDeduction,
    setPersonalLoanDeduction: (val: string) => setPersonalLoanDeduction(sanitizeNumber(val)),
    creditCardLimit,
    setCreditCardLimit: (val: string) => setCreditCardLimit(sanitizeNumber(val)),
    autoLoanDeduction,
    setAutoLoanDeduction: (val: string) => setAutoLoanDeduction(sanitizeNumber(val)),
    housingLoanDeduction,
    setHousingLoanDeduction: (val: string) => setHousingLoanDeduction(sanitizeNumber(val)),
    activePicker,
    setActivePicker,
    bannerVisible,
    setBannerVisible,
    bannerMessage,
    netDeductionFormatted,
    handleCalculate,
    handleBack: () => router.back(),
  };
}
