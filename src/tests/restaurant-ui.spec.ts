import { expect } from 'chai'
import { RestaurantPage } from '../logic/pages/restaurant-page'
import { CreateRestaurantPopup } from '../logic/pages/restaurant-page'
import { BrowserWrapper } from '../infra/browser/browser'
import configJson from '../../config.json'
import restaurantsAPI from '../logic/REST/restaurantsAPI'

describe('UI tests', () => {
  let browser: BrowserWrapper
  let resturantPage: RestaurantPage
  let createRestaurantPopup: CreateRestaurantPopup

  beforeEach('Start browser', async () => {
    browser = new BrowserWrapper()
    resturantPage = await browser.newPage(RestaurantPage, configJson.baseUiUrl)
    createRestaurantPopup = await browser.newPage(CreateRestaurantPopup, configJson.baseUiUrl)
  })

  afterEach('Close browser', async () => {
    await browser.close()
  })

  it('Validate "Create new Restaurant Popup" opened', async function () {
    await resturantPage.clickreateNewRestaurantButtone()
    const actualResult = await createRestaurantPopup.checkIfTitleInCreateResturantPopupExcit()
    expect(actualResult, 'Restaurants popup was not opened').to.be.true
  })

  it('Validate "Restaurants list from UI and API is equal" ', async function () {
    let restaurantsListAPI = await restaurantsAPI.getRestaurants()
    let restaurantsListUI = await resturantPage.getResturantListLength()
    expect(restaurantsListAPI.data?.length === restaurantsListUI, 'The length of the list of restaurants in the UI and API does not match').to.be.true
  })

  it('Validate "Create a new restaurant"', async function () {
    await resturantPage.clickreateNewRestaurantButtone()
    const numOfRestaurantbeforCreate = await resturantPage.getResturantListLength()
    await createRestaurantPopup.sendKeysOnIdField()
    await createRestaurantPopup.sendKeysOnNameField()
    await createRestaurantPopup.sendKeysOnAddressField()
    await createRestaurantPopup.sendKeysOnScoreField()
    await createRestaurantPopup.clickOnSubmitButton()
    await resturantPage.clickOnOKButton()
    await resturantPage.checkIfTheResturantListGrewByOne(numOfRestaurantbeforCreate)
  })

  it('Validate "Create a restaurant with API and check its appearance in UI"', async function () {
    const numOfRestaurantbeforCreate = await resturantPage.getResturantListLength()
    const myNewRest = { address: 'My Addess 1', id: 233, name: 'My Restaurant', score: 2.3 }
    await restaurantsAPI.createRestaurant(myNewRest)
    browser.refreshPage()
    await resturantPage.checkIfTheResturantListGrewByOne(numOfRestaurantbeforCreate)
  })

  it('Validate "delete Restaurant"', async function () {
    const newRest = { address: 'PT', id: 1111, name: 'Nati A.S', score: 5 }
    await restaurantsAPI.createRestaurant(newRest)
    let numOfRestaurantbeforDelete = await resturantPage.getResturantListLength()
    browser.refreshPage()
    await resturantPage.checkIfTheResturantListGrewByOne(numOfRestaurantbeforDelete)
    numOfRestaurantbeforDelete++
    await resturantPage.clickOnDeleteFirstResturantButton()
    await resturantPage.clickOnOKButton()
    await resturantPage.checkIfTheResturantListIsOneLess(numOfRestaurantbeforDelete)
  })

  it('Validate "Delete a restaurant with API and check its appearance in UI"', async function () {
    const newRest = { address: 'PT', id: 1111, name: 'Nati A.S', score: 5 }
    await restaurantsAPI.createRestaurant(newRest)
    let numOfRestaurantbeforDelete = await resturantPage.getResturantListLength()
    browser.refreshPage()
    await resturantPage.checkIfTheResturantListGrewByOne(numOfRestaurantbeforDelete)
    numOfRestaurantbeforDelete++
    await restaurantsAPI.deleteRestaurantById(1111)
    browser.refreshPage()
    await resturantPage.checkIfTheResturantListIsOneLess(numOfRestaurantbeforDelete)
  })

  it('Validate "Cancel create new restaurant"', async function () {
    await resturantPage.clickreateNewRestaurantButtone()
    await createRestaurantPopup.clickOnCloseButton()
    await createRestaurantPopup.checkIfCreateResturantPopupNotExcit()
  })
})
