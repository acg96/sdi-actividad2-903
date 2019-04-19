package com.uniovi.tests.pageobjects;

import org.openqa.selenium.WebDriver;

import com.uniovi.tests.util.SeleniumUtils;

public class PO_PrivateView extends PO_NavView {

	/**
	 * Comprueba que se muestre el mensaje de área privada
	 * 
	 * @param driver
	 */
	public static void checkHomePage(WebDriver driver) {
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "privateArea", getTimeout());
	}
}