export const getDomainColor = (domain: string) => {
  switch (domain) {
    case 'CS':
      return 'bg-[#EEF2FF] text-[#4F46E5]'; // indigo
    case 'Cyber':
      return 'bg-[#FEE2E2] text-[#DC2626]'; // red
    case 'Product':
      return 'bg-[#D1FAE5] text-[#059669]'; // green
    case 'Sales':
      return 'bg-[#FEF3C7] text-[#D97706]'; // amber
    default:
      return 'bg-[#F1F5F9] text-[#64748B]'; // gray
  }
};

export const getCompanyInitial = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};
