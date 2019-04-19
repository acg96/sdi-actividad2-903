package com.uniovi.tests.pageobjects;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.util.SeleniumUtils;

public class PO_LoginView extends PO_NavView {
	/**
	 * Rellenar el formulario de login
	 * 
	 * @param driver
	 * @param emailp    con el email
	 * @param passwordp con la contraseña
	 */
	public static void fillForm(WebDriver driver, String emailp, String passwordp) {
		WebElement email = driver.findElement(By.name("username"));
		email.click();
		email.clear();
		email.sendKeys(emailp);
		WebElement password = driver.findElement(By.name("password"));
		password.click();
		password.clear();
		password.sendKeys(passwordp);
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}
	
	/**
	 * Rellenar el formulario de login para la API REST
	 * 
	 * @param driver
	 * @param emailp    con el email
	 * @param passwordp con la contraseña
	 */
	public static void fillFormREST(WebDriver driver, String emailp, String passwordp) {
		List<WebElement> list = SeleniumUtils.EsperaCargaPagina(driver, "id", "email", getTimeout());
		WebElement email = list.get(0);
		email.click();
		email.clear();
		email.sendKeys(emailp);
		WebElement password = driver.findElement(By.name("password"));
		password.click();
		password.clear();
		password.sendKeys(passwordp);
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}

	/**
	 * Iniciar sesión de usuario normal
	 * 
	 * @param driver
	 * @param user     : String con el usuario
	 * @param password : String con la contraseña
	 */
	public static void inicioDeSesionUser(WebDriver driver, String user, String password) {
		// Se comprueba que esté en la ventana principal
		PO_HomeView.checkWelcome(driver, PO_Properties.getSPANISH());
		// Se comprueba que esté el menú correcto
		PO_NavView.checkMenuNotBeingInLogged(driver);
		// Se clica sobre la opción de menú y se comprueba que va donde debe
		PO_NavView.clickOption(driver, "/identificarse", "text",
				PO_NavView.getP().getString("login.title", PO_Properties.getSPANISH()));
		// Se comprueba que no muestra mensaje de login incorrecto
		PO_LoginView.checkFirstLoginAttempt(driver);
		// Se rellena el formulario con datos válidos
		PO_LoginView.fillForm(driver, user, password);
		// Se comprueba que está logueado
		PO_NavView.checkMenuBeingInLoggedUser(driver);
		PO_PrivateView.checkHomePage(driver);
	}
	
	/**
	 * Iniciar sesión de usuario normal API REST
	 * 
	 * @param driver
	 * @param user     : String con el usuario
	 * @param password : String con la contraseña
	 */
	public static void inicioDeSesionUserREST(WebDriver driver, String user, String password) {
		// Se comprueba que no muestra mensaje de login incorrecto
		PO_LoginView.checkFirstLoginAttemptREST(driver);
		// Se rellena el formulario con datos válidos
		PO_LoginView.fillFormREST(driver, user, password);
		// Se comprueba que está logueado
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Título", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Detalles", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Precio", PO_View.getTimeout());
	}

	/**
	 * Iniciar sesión con el usuario administrador
	 * 
	 * @param driver
	 */
	public static void inicioDeSesionAdmin(WebDriver driver) {
		// Se comprueba que esté el menú correcto
		PO_NavView.checkMenuNotBeingInLogged(driver);
		// Se clica sobre la opción de menú y se comprueba que va donde debe
		PO_NavView.clickOption(driver, "/identificarse", "text",
				PO_NavView.getP().getString("login.title", PO_Properties.getSPANISH()));
		// Se comprueba que no muestra mensaje de login incorrecto
		PO_LoginView.checkFirstLoginAttempt(driver);
		// Se rellena el formulario con datos válidos
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");
		// Se comprueba que está logueado
		PO_NavView.checkMenuBeingInLoggedAdmin(driver);
		PO_PrivateView.checkHomePage(driver);
	}

	/**
	 * Comprueba que esté en la página de login
	 * 
	 * @param driver
	 * @param language con el identificador del lenguaje en el que comprobarlo
	 */
	public static void checkIsInLogInView(WebDriver driver, int language) {
		SeleniumUtils.EsperaCargaPagina(driver, "text", p.getString("login.title", language), getTimeout());
	}

	/**
	 * Comprobar que sale el mensaje de login invalido además de que el menú siga el
	 * que debe es decir, no estando logueado
	 * 
	 * @param driver
	 */
	public static void checkInvalidLogin(WebDriver driver) {
		checkMenuNotBeingInLogged(driver);
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "loginError", getTimeout());
	}
	
	/**
	 * Comprobar que sale el mensaje de login invalido además de que esté donde debe API REST
	 * 
	 * @param driver
	 */
	public static void checkInvalidLoginREST(WebDriver driver) {
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Identifícate", PO_View.getTimeout());
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "loginError", getTimeout());
	}

	/**
	 * Comprueba que no se encuentre el mensaje de login incorrecto al acceder al
	 * login por primera vez
	 * 
	 * @param driver
	 */
	public static void checkFirstLoginAttempt(WebDriver driver) {
		checkMenuNotBeingInLogged(driver);
		SeleniumUtils.esperaCargaPaginaNoIdPresente(driver, "loginError", getTimeout());
	}
	
	/**
	 * Comprueba que no se encuentre el mensaje de login incorrecto al acceder al
	 * login por primera vez para la API REST
	 * 
	 * @param driver
	 */
	public static void checkFirstLoginAttemptREST(WebDriver driver) {
		SeleniumUtils.esperaCargaPaginaNoIdPresente(driver, "loginError", getTimeout());
	}
}
