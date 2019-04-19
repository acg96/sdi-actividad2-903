package com.uniovi.tests.pageobjects;

import static org.junit.Assert.assertTrue;
import java.util.List;
import org.openqa.selenium.*;
import com.uniovi.tests.util.SeleniumUtils;

public class PO_NavView extends PO_View {
	/**
	 * Clica una de las opciones principales (a href) y comprueba que se vaya a la
	 * vista con el elemento de tipo type con el texto Destino
	 * 
	 * @param driver: apuntando al navegador abierto actualmente.
	 * @param textOption: Texto de la opción principal.
	 * @param criterio: "id" or "class" or "text" or "@attribute" or "free". Si el
	 *        valor de criterio es free es una expresion xpath completa.
	 * @param textoDestino: texto correspondiente a la búsqueda de la página
	 *        destino.
	 */
	public static void clickOption(WebDriver driver, String textOption, String criterio, String textoDestino) {
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "@href", textOption, getTimeout());
		assertTrue(elementos.size() == 1);
		elementos.get(0).click();
		elementos = SeleniumUtils.EsperaCargaPagina(driver, criterio, textoDestino, getTimeout());
		assertTrue(elementos.size() == 1);
	}

	static void checkMenuBeingInLogged(WebDriver driver) {
		checkLogOutAppear(driver);
		checkLoginNotAppear(driver);
		checkSignUpNotAppear(driver);
		checkEmailAppear(driver);
	}

	/**
	 * Comprueba el estado del menú estando logueado como usuario normal
	 * 
	 * @param driver
	 */
	public static void checkMenuBeingInLoggedUser(WebDriver driver) {
		checkMenuBeingInLogged(driver);
		checkUsersMenuNotAppear(driver);
		checkOffersMenuAppear(driver);
		checkWalletAppear(driver);
	}

	/**
	 * Comprueba el estado del menú estando logueado como usuario administrador
	 * 
	 * @param driver
	 */
	public static void checkMenuBeingInLoggedAdmin(WebDriver driver) {
		checkMenuBeingInLogged(driver);
		checkUsersMenuAppear(driver);
		checkWalletNotAppear(driver);
		checkOffersMenuNotAppear(driver);

	}

	/**
	 * Comprueba el estado del menú no estando logueado
	 * 
	 * @param driver
	 */
	public static void checkMenuNotBeingInLogged(WebDriver driver) {
		checkEmailNotAppear(driver);
		checkWalletNotAppear(driver);
		checkOffersMenuNotAppear(driver);
		checkUsersMenuNotAppear(driver);
		checkSignUpAppear(driver);
		checkLoginAppear(driver);
		checkLogOutNotAppear(driver);
	}

	static public void checkEmailNotAppear(WebDriver driver) {
		SeleniumUtils.esperaCargaPaginaNoIdPresente(driver, "navEmail", getTimeout());
	}

	static public void checkWalletNotAppear(WebDriver driver) {
		SeleniumUtils.esperaCargaPaginaNoIdPresente(driver, "navMoney", getTimeout());
	}

	static public void checkOffersMenuNotAppear(WebDriver driver) {
		SeleniumUtils.esperaCargaPaginaNoIdPresente(driver, "offers-menu", getTimeout());
	}

	static public void checkUsersMenuNotAppear(WebDriver driver) {
		SeleniumUtils.esperaCargaPaginaNoIdPresente(driver, "users-menu", getTimeout());
	}

	static public void checkSignUpAppear(WebDriver driver) {
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "navSignup", getTimeout());
	}

	static public void checkLoginAppear(WebDriver driver) {
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "navLogin", getTimeout());
	}

	static public void checkLogOutNotAppear(WebDriver driver) {
		SeleniumUtils.esperaCargaPaginaNoIdPresente(driver, "navLogout", getTimeout());
	}

	static public void checkLogOutAppear(WebDriver driver) {
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "navLogout", getTimeout());
	}

	static public void checkLoginNotAppear(WebDriver driver) {
		SeleniumUtils.esperaCargaPaginaNoIdPresente(driver, "navLogin", getTimeout());
	}

	static public void checkSignUpNotAppear(WebDriver driver) {
		SeleniumUtils.esperaCargaPaginaNoIdPresente(driver, "navSignup", getTimeout());
	}

	static public void checkOffersMenuAppear(WebDriver driver) {
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "offers-menu", getTimeout());
	}

	static public void checkUsersMenuAppear(WebDriver driver) {
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "users-menu", getTimeout());
	}

	static public void checkEmailAppear(WebDriver driver) {
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "navEmail", getTimeout());
	}

	static public void checkWalletAppear(WebDriver driver) {
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "navMoney", getTimeout());
	}
}