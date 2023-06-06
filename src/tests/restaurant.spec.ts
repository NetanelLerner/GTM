import { ApiResponse } from '../infra/rest/api-response'
import { Restaurant } from '../logic/REST/API-Response/get-restaurants-response'
import { expect } from 'chai'

import restaurantsAPI from '../logic/REST/restaurantsAPI'

describe('Restaurants tests', () => {
  before('Reset restaurant server', async () => {
    //Arrange
    await restaurantsAPI.resetServer()
  })

  it('Validate the amount of restaurants', async () => {
    //Act
    const restaurants: ApiResponse<Restaurant[]> = await restaurantsAPI.getRestaurants()

    //Assert
    expect(restaurants.success).to.be.true
    const actualAmount = restaurants.data?.length
    expect(actualAmount).to.equal(3, 'Restaurants amount is not as expected')
  })

  it('Get restaurant by id', async () => {
    //Arrange
    const myNewRest = { address: 'My Addess 1', id: 233, name: 'My Restaurant', score: 2.3 }
    const createResponse = await restaurantsAPI.createRestaurant(myNewRest)

    //Act
    const getByIdResponse = await restaurantsAPI.getRestaurantById(233)

    //Assert
    expect(getByIdResponse.status).to.equal(200)
    expect(getByIdResponse.success).to.be.true
    expect(getByIdResponse.data).to.deep.equal(myNewRest)
  })

  it('Get non exsisting restaurant', async () => {
    //Act
    const getByIdResponse = await restaurantsAPI.getRestaurantById(233)

    //Assert
    expect(getByIdResponse.error).to.equal('restaurant with given id not found')
    expect(getByIdResponse.success).to.be.false
    expect(getByIdResponse.status).to.equal(404)
  })

  it('Create new restaurant', async () => {
    //Arrange
    const myNewRest = { address: 'PT', id: 1111, name: 'Nati A.S', score: 5 }
    const createResponse = await restaurantsAPI.createRestaurant(myNewRest)

    //Act
    const getByIdResponse = await restaurantsAPI.getRestaurantById(myNewRest.id)

    //Assert
    expect(createResponse.status).to.equal(201)
    expect(createResponse.success).to.be.true
    expect(getByIdResponse.data).to.deep.equal(myNewRest)
  })

  it('Create a new restaurant with an existing ID', async () => {
    //Arrange
    const firstRest = { address: 'PT', id: 45, name: 'Nati A.S', score: 5 }
    const secondRest = { address: 'TLV', id: 45, name: 'Nati A.S2', score: 5 }
    await restaurantsAPI.createRestaurant(firstRest)
    const createSecResponse = await restaurantsAPI.createRestaurant(secondRest)

    //Assert
    expect(createSecResponse.status).to.equal(409)
    expect(createSecResponse.success).to.be.false
  })

  it('Delete restaurant', async () => {
    //Arrange
    const newRest = { address: 'PT', id: 1111, name: 'Nati A.S', score: 5 }
    const createResponse = await restaurantsAPI.createRestaurant(newRest)
    const DeleteResponse = await restaurantsAPI.deleteRestaurantById(newRest.id)

    //Act
    const getByIdResponse = await restaurantsAPI.getRestaurantById(newRest.id)

    //Assert
    expect(DeleteResponse.success).to.be.true
    expect(getByIdResponse.success).to.be.false
    expect(getByIdResponse.status).to.equal(404)
  })

  it('Delete a restaurant Which does not exist', async () => {
    //Arrange
    const DeleteResponse = await restaurantsAPI.deleteRestaurantById(1)

    //Assert
    expect(DeleteResponse.error).to.equal('restaurant with given id not found')
    expect(DeleteResponse.success).to.be.false
    expect(DeleteResponse.status).to.equal(404)
  })
})
