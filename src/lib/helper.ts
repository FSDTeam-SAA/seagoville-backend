const getStatusSubject = (status: string) => {
  const formatted = status.charAt(0).toUpperCase() + status.slice(1);

  return `Your Order is ${formatted}`;
};

export default getStatusSubject;