package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.util.SeleniumUtils;

public class PO_RegisterView extends PO_NavView {

	/**
	 * Rellenar el formulario de registro
	 * 
	 * @param driver
	 * @param emailp        con el email
	 * @param namep         con el nombre
	 * @param lastnamep     con los apellidos
	 * @param passwordp     con la contraseña
	 * @param passwordconfp con la repetición de la contraseña
	 */
	static public void fillForm(WebDriver driver, String emailp, String namep, String lastnamep, String passwordp,
			String passwordconfp) {
		WebElement email = driver.findElement(By.name("email"));
		email.click();
		email.clear();
		email.sendKeys(emailp);
		WebElement name = driver.findElement(By.name("name"));
		name.click();
		name.clear();
		name.sendKeys(namep);
		WebElement lastname = driver.findElement(By.name("lastName"));
		lastname.click();
		lastname.clear();
		lastname.sendKeys(lastnamep);
		WebElement password = driver.findElement(By.name("password"));
		password.click();
		password.clear();
		password.sendKeys(passwordp);
		WebElement passwordConfirm = driver.findElement(By.name("passwordConfirm"));
		passwordConfirm.click();
		passwordConfirm.clear();
		passwordConfirm.sendKeys(passwordconfp);
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}

	/**
	 * Comprueba que esté en la página de registro
	 * 
	 * @param driver
	 * @param language con el identificador del lenguaje en el que comprobarlo
	 */
	public static void checkIsInSignUpView(WebDriver driver, int language) {
		SeleniumUtils.EsperaCargaPagina(driver, "text", p.getString("signup.title", language), getTimeout());
	}

	/**
	 * Comprobar que sale el mensaje en función del elemento que no era válido
	 * además de tener el menú en el estado correcto que debe, es decir, no estando
	 * logueado
	 * 
	 * @param driver
	 * @param propiedad con el nombre de la propiedad que debe estar visible
	 * @param locale    con el identificador del idioma
	 */
	public static void checkInvalidSignIn(WebDriver driver, String propiedad, int locale) {
		checkMenuNotBeingInLogged(driver);
		SeleniumUtils.textoPresentePagina(driver, p.getString(propiedad, locale));
	}
}
