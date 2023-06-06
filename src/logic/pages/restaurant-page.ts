import { Page } from 'playwright'
import { PageBase } from './page-base'

const CREATE_NEW_RESTURANT_BUTTON = "//button[contains(text(),'Create new')]"
const LIST_OF_RESTAURANT = '#main-table > table > tbody > tr'
const DELETE_RESTURANT_BUTTON = "//button[contains(text(),'X')]"

const POPUP_BLOK = '#create-new-popup'
const POPUP_TITLE = "//h2[contains(text(),'Create new restaurant')]"
const ID_FIELD = '#id'
const NAME_FIELD = '#name'
const ADDRESS_FIELD = '#address'
const SCORE_FIELD = '#score'
const SUBMIT_BUTTON = "//button[contains(text(),'Submit')]"
const CLOSE_BUTTON = '#close-button'

const OK_BUTTON = "//button[contains(text(),'OK')]"

export class RestaurantPage extends PageBase {
  constructor(page: Page) {
    super(page)
  }

  clickreateNewRestaurantButtone = async () => {
    await this.page.click(CREATE_NEW_RESTURANT_BUTTON)
  }

  getResturantListLength = async () => {
    return (await this.page.$$(LIST_OF_RESTAURANT)).length
  }

  clickOnOKButton = async () => {
    await this.page.click(OK_BUTTON)
  }

  checkIfTheResturantListGrewByOne = async (initialSize: number) =>
    await this.page
      .waitForFunction(`document.querySelectorAll('${LIST_OF_RESTAURANT}').length === ${initialSize + 1}`, { timeout: 19999, polling: 200 })
      .catch(() => {
        throw new Error(`The restaurant list did not grow by one within the specified time.`)
      })

  checkIfTheResturantListIsOneLess = async (initialSize: number) =>
    await this.page
      .waitForFunction(`document.querySelectorAll('${LIST_OF_RESTAURANT}').length === ${initialSize - 1}`, { timeout: 19999, polling: 200 })
      .catch(() => {
        throw new Error(`The restaurant list did not one less within the specified time.`)
      })

  clickOnDeleteFirstResturantButton = async () => {
    await this.page.click(DELETE_RESTURANT_BUTTON)
  }

  checkIfResturantIsEmpty = async () => {
    return await this.page.isVisible(LIST_OF_RESTAURANT)
  }
}

export class CreateRestaurantPopup extends PageBase {
  constructor(page: Page) {
    super(page)
  }

  checkIfCreateResturantPopupNotExcit = async () => {
    return await this.page.isVisible(POPUP_BLOK)
  }

  checkIfTitleInCreateResturantPopupExcit = async () => {
    return await this.page.isVisible(POPUP_TITLE)
  }

  sendKeysOnIdField = async () => {
    await this.page.fill(ID_FIELD, '12456789')
  }

  sendKeysOnNameField = async () => {
    await this.page.fill(NAME_FIELD, 'netanel')
  }

  sendKeysOnAddressField = async () => {
    await this.page.fill(ADDRESS_FIELD, 'PT')
  }

  sendKeysOnScoreField = async () => {
    await this.page.fill(SCORE_FIELD, '1432')
  }

  clickOnSubmitButton = async () => {
    await this.page.click(SUBMIT_BUTTON)
  }

  clickOnCloseButton = async () => {
    await this.page.click(CLOSE_BUTTON)
  }
}
