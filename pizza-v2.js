const { deepLog, readCsvFile } = require('./utils')
const DataLoader = require('dataloader')

const loadPizzaToppingsLoader = new DataLoader((pizzaIds) => {
  return Promise.all([
    readCsvFile('pizza_toppings.csv'),
    readCsvFile('toppings.csv'),
  ]).then(([pizzaToppings, toppings]) => {
    return pizzaIds.map((pizzaId) => {
      return pizzaToppings
        .filter((pizzaTopping) => pizzaTopping.pizza_id === pizzaId)
        .map((pizzaTopping) => pizzaTopping.topping_id)
        .map((toppingId) => toppings.filter((topping) => toppingId === topping.id)[0])
    })
  })
})

readCsvFile('pizzas.csv')
  .then((pizzas) => {
    return Promise.all(pizzas.map((pizza) => (
      loadPizzaToppingsLoader.load(pizza.id).then((toppings) => ({
        ...pizza,
        toppings,
      }))  
    )))
  })
  .then((pizzasWithToppings) => {
    deepLog(pizzasWithToppings)
  })
  .catch((err) => {
    console.log('Failed to load pizzas:', err)
  })
