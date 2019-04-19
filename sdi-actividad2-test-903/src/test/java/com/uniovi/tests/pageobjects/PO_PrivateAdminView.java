package com.uniovi.tests.pageobjects;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.uniovi.tests.util.SeleniumUtils;

public class PO_PrivateAdminView extends PO_PrivateView {
	public static final int ULTIMO_LISTA = -1000;
	public static final int PRIMERO_LISTA = 0;

	/**
	 * Comprobar que el menú está como debe para un usuario administrador
	 * 
	 * @param driver
	 */
	public static void checkMenu(WebDriver driver) {
		checkMenuBeingInLoggedAdmin(driver);
	}


	/**
	 * Comprobar que un usuario, dado su email, está presente en la página con el
	 * listado de usuarios
	 * 
	 * @param driver
	 * @param email  que se usará como id para buscarlo en la página
	 */
	public static void checkUserInList(WebDriver driver, String email) {
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, email, getTimeout());
	}

	/**
	 * Ir a una opción de menú
	 * 
	 * @param driver
	 * @param nameOption con el String con el nombre de la opción de menú
	 */
	public static void clickOpcionMenu(WebDriver driver, String nameOption) {
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", "btnUsersManagement", getTimeout());
		elementos.get(0).click();
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", "usersDropdownMenuButton", getTimeout());
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "text", nameOption, getTimeout());
		elementos.get(0).click();
	}

	/**
	 * Comprobar que todos los usuarios pasados por lista están mostrándose y no
	 * están repetidos
	 * 
	 * @param driver
	 * @param emails con una lista de string que contiene los identificadores
	 *               (emails)
	 */
	public static void checkUsersInList(WebDriver driver, List<String> emails) {
		List<WebElement> list = SeleniumUtils.EsperaCargaPagina(driver, "class", "emailsList", getTimeout());
		assertTrue("No hay usuarios", !list.isEmpty());
		assertTrue("No concuerda el número de usuarios", list.size() == emails.size());
		for (String email : emails) {
			boolean check = false;
			for (WebElement w : list) {
				if (w.getAttribute("id").equals(email)) {
					check = true;
					break;
				}
			}
			assertTrue("Falta el usuario " + email, check);
		}
	}

	/**
	 * Borra usuarios por las posiciones dadas y comprueba que después no estén
	 * 
	 * @param driver
	 * @param pos    con las posiciones a borrar
	 */
	public static void borrarUsuariosPorPosicion(WebDriver driver, Integer... pos) {
		List<WebElement> list = SeleniumUtils.EsperaCargaPagina(driver, "class", "form-check-input", getTimeout());
		assertTrue("No hay usuarios", !list.isEmpty());
		for (Integer i : pos) {
			checkIndividualPosition(list.size(), i);
		}
		List<String> idCheckBoxSeleccionados = new ArrayList<String>();
		for (Integer i : pos) {
			int e = i;
			if (i == ULTIMO_LISTA)
				e = list.size() - 1;
			list.get(e).click();
			idCheckBoxSeleccionados.add(list.get(e).getAttribute("id"));
		}
		List<WebElement> botonEliminar = SeleniumUtils.EsperaCargaPagina(driver, "class", "btn", getTimeout());
		assertTrue("No está el botón de eliminar", !botonEliminar.isEmpty());
		assertTrue("Hay más de un botón", botonEliminar.size() == 1);
		botonEliminar.get(0).click();
		list = SeleniumUtils.EsperaCargaPagina(driver, "class", "form-check-input", getTimeout());
		for (WebElement w : list) {
			for (String s : idCheckBoxSeleccionados) {
				assertTrue("El usuario eliminado sigue estando", !w.getAttribute("id").equals(s));
			}
		}
	}

	private static void checkIndividualPosition(int listSize, int pos) {
		assertTrue("La posición " + pos + " indicada no existe",
				pos < listSize && (pos >= PRIMERO_LISTA || pos == ULTIMO_LISTA));
	}

}