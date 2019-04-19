package com.uniovi.tests.pageobjects;

import org.openqa.selenium.WebDriver;

import com.uniovi.tests.util.SeleniumUtils;

public class PO_HomeView extends PO_NavView {
	/**
	 * Comprueba que se encuentre el mensaje de bienvenida
	 * 
	 * @param driver
	 * @param language fichero de propiedades del idioma en el que se quiere
	 *                 comprobar
	 */
	public static void checkWelcome(WebDriver driver, int language) {
		SeleniumUtils.EsperaCargaPagina(driver, "text", p.getString("welcome.message", language), getTimeout());
	}

	/**
	 * Comprueba que el menú esté como debe estar, en este caso el que se encuentra
	 * sin estar logueado
	 * 
	 * @param driver
	 */
	public static void checkMenuStatus(WebDriver driver) {
		checkMenuNotBeingInLogged(driver);
	}
}
