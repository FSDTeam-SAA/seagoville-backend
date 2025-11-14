import Toppings from "../toppings/toppings.model";

const toppingsAnalysis = async () => {
  const totalToppings = await Toppings.countDocuments();
  const availableToppings = await Toppings.countDocuments({
    isAvailable: true,
  });

  const outOfStockToppings = await Toppings.countDocuments({
    isAvailable: false,
  });

  const categoriesCount = await Toppings.distinct("category").then(
    (cats) => cats.length
  );

  return {
    totalToppings,
    availableToppings,
    outOfStockToppings,
    categoriesCount,
  };
};

const analysisService = {
  toppingsAnalysis,
};

export default analysisService;
