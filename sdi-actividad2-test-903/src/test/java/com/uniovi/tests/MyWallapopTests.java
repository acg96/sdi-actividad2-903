package com.uniovi.tests;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import com.uniovi.tests.pageobjects.*;
import com.uniovi.tests.util.SeleniumUtils;

import org.junit.runners.MethodSorters;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class MyWallapopTests {
	final static String URL_LOCAL = "http://localhost:8081";
	final static String URL_AMAZON = "http://ec2-54-185-22-249.us-west-2.compute.amazonaws.com:8081";

	static String PathFirefox64 = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
	static String Geckdriver024 = "C:\\Selenium\\geckodriver024win64.exe";
	static WebDriver driver = getDriver(PathFirefox64, Geckdriver024);

	// *****************CAMBIAR AQUÍ POR OTRA URL*******************
	static String URL = URL_LOCAL; // Cambiar por URL_LOCAL
	// *****************CAMBIAR AQUÍ POR OTRA URL*******************

	public static WebDriver getDriver(String PathFirefox, String Geckdriver) {
		System.setProperty("webdriver.firefox.bin", PathFirefox);
		System.setProperty("webdriver.gecko.driver", Geckdriver);
		WebDriver driver = new FirefoxDriver();
		return driver;
	}

	// Antes de cada prueba se navega al URL home de la aplicación
	@Before
	public void setUp() {
		initDB();
		driver.navigate().to(URL);
	}

	// Después de cada prueba se borran las cookies del navegador
	@After
	public void tearDown() {
		driver.manage().deleteAllCookies();
	}

	// Antes de la primera prueba
	@BeforeClass
	static public void begin() {
	}

	// Al finalizar la última prueba
	@AfterClass
	static public void end() {
		driver.quit(); // Cierra el navegador
	}

	public void initDB() {
		driver.navigate().to(URL + "/reset");
		SeleniumUtils.esperarSegundos(driver, 3);
	}

	// PR01. Registro de usuario con datos válidos (email vacío)
	@Test
	public void PR01() {
		// Se comprueba que esté en la ventana principal
		PO_HomeView.checkWelcome(driver, PO_Properties.getSPANISH());
		// Se comprueba que esté el menú correcto
		PO_NavView.checkMenuNotBeingInLogged(driver);
		// Se clica sobre la opción de menú y se comprueba que va donde debe
		PO_NavView.clickOption(driver, "/registrarse", "text",
				PO_NavView.getP().getString("signup.title", PO_Properties.getSPANISH()));
		// Se rellena el formulario con datos válidos
		PO_RegisterView.fillForm(driver, "   ", "Selenium", "Spring Boot", "123456", "123456");
		// Se comprueba que no está logueado y sigue en página de registro con un
		// mensaje de campo vacío
		PO_NavView.checkMenuNotBeingInLogged(driver);
		PO_RegisterView.checkInvalidSignIn(driver, "Error.empty", PO_Properties.getSPANISH());
	}

	// PR02. Registro de usuario con datos inválidos (repetición de contraseña
	// inválida)
	@Test
	public void PR02() {
		// Se comprueba que esté en la ventana principal
		PO_HomeView.checkWelcome(driver, PO_Properties.getSPANISH());
		// Se comprueba que esté el menú correcto
		PO_NavView.checkMenuNotBeingInLogged(driver);
		// Se clica sobre la opción de menú y se comprueba que va donde debe
		PO_NavView.clickOption(driver, "/registrarse", "text",
				PO_NavView.getP().getString("signup.title", PO_Properties.getSPANISH()));
		// Se rellena el formulario con repetición de contraseña inválida
		PO_RegisterView.fillForm(driver, "pruebaSelenium2@gmail.com", "Selenium2", "Spring2 Boot2", "123456",
				"1234567");
		// Se comprueba que no está logueado y sigue en página de registro con el
		// mensaje de error de contraseña no igual
		PO_NavView.checkMenuNotBeingInLogged(driver);
		PO_RegisterView.checkInvalidSignIn(driver, "Error.signup.passwordConfirm.coincidence",
				PO_Properties.getSPANISH());
	}

	// PR03. Registro de usuario con datos inválidos (email existente)
	@Test
	public void PR03() {
		// Se comprueba que esté en la ventana principal
		PO_HomeView.checkWelcome(driver, PO_Properties.getSPANISH());
		// Se comprueba que esté el menú correcto
		PO_NavView.checkMenuNotBeingInLogged(driver);
		// Se clica sobre la opción de menú y se comprueba que va donde debe
		PO_NavView.clickOption(driver, "/registrarse", "text",
				PO_NavView.getP().getString("signup.title", PO_Properties.getSPANISH()));
		// Se rellena el formulario con un email existente
		PO_RegisterView.fillForm(driver, "admin@email.com", "Selenium2", "Spring2 Boot2", "123456", "123456");
		// Se comprueba que no está logueado y sigue en página de registro con el
		// mensaje de error de email existente
		PO_NavView.checkMenuNotBeingInLogged(driver);
		PO_RegisterView.checkInvalidSignIn(driver, "Error.signup.email.duplicate", PO_Properties.getSPANISH());
	}

	// PR04. Inicio de sesión con datos válidos
	@Test
	public void PR04() {
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
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");
		// Se comprueba que está logueado
		PO_NavView.checkMenuBeingInLoggedAdmin(driver);
		PO_PrivateView.checkHomePage(driver);
	}

	// PR05. Inicio de sesión inválido con email existente y
	// contraseña incorrecta
	@Test
	public void PR05() {
		// Se comprueba que esté en la ventana principal
		PO_HomeView.checkWelcome(driver, PO_Properties.getSPANISH());
		// Se comprueba que esté el menú correcto
		PO_NavView.checkMenuNotBeingInLogged(driver);
		// Se clica sobre la opción de menú y se comprueba que va donde debe
		PO_NavView.clickOption(driver, "/identificarse", "text",
				PO_NavView.getP().getString("login.title", PO_Properties.getSPANISH()));
		// Se comprueba que no muestra mensaje de login incorrecto
		PO_LoginView.checkFirstLoginAttempt(driver);
		// Se rellena el formulario con email válido y contraseña incorrecta
		PO_LoginView.fillForm(driver, "prueba@gmail.com", "1234567");
		// Se comprueba que no está logueado y sigue en la página de login con el
		// mensaje de error
		PO_LoginView.checkInvalidLogin(driver);
	}

	// PR06. Inicio de sesión con datos válidos con campo email vacío
	@Test
	public void PR06() {
		// Se comprueba que esté en la ventana principal
		PO_HomeView.checkWelcome(driver, PO_Properties.getSPANISH());
		// Se comprueba que esté el menú correcto
		PO_NavView.checkMenuNotBeingInLogged(driver);
		// Se clica sobre la opción de menú y se comprueba que va donde debe
		PO_NavView.clickOption(driver, "/identificarse", "text",
				PO_NavView.getP().getString("login.title", PO_Properties.getSPANISH()));
		// Se comprueba que no muestra mensaje de login incorrecto
		PO_LoginView.checkFirstLoginAttempt(driver);
		// Se rellena el formulario con el email vacío
		PO_LoginView.fillForm(driver, "  ", "123456");
		// Se comprueba que no está logueado y sigue en la página de login con el
		// mensaje de error
		PO_NavView.checkMenuNotBeingInLogged(driver);
		PO_LoginView.checkIsInLogInView(driver, PO_Properties.getSPANISH());
		PO_LoginView.checkInvalidLogin(driver);
	}

	// PR07. Inicio de sesión inválido con email no existente
	@Test
	public void PR07() {
		// Se comprueba que esté en la ventana principal
		PO_HomeView.checkWelcome(driver, PO_Properties.getSPANISH());
		// Se comprueba que esté el menú correcto
		PO_NavView.checkMenuNotBeingInLogged(driver);
		// Se clica sobre la opción de menú y se comprueba que va donde debe
		PO_NavView.clickOption(driver, "/identificarse", "text",
				PO_NavView.getP().getString("login.title", PO_Properties.getSPANISH()));
		// Se comprueba que no muestra mensaje de login incorrecto
		PO_LoginView.checkFirstLoginAttempt(driver);
		// Se rellena el formulario con email no existente
		PO_LoginView.fillForm(driver, "noexiste@gmail.com", "123456");
		// Se comprueba que no está logueado y sigue en la página de login con el
		// mensaje de error
		PO_LoginView.checkInvalidLogin(driver);
	}

	// PR08. Hacer clic en la opción de salir de sesión y comprobar que se va a la
	// página de login
	@Test
	public void PR08() {
		// Primero se inicia sesión como usuario estándar
		PO_LoginView.inicioDeSesionUser(driver, "prueba2@gmail.com", "123456");
		// Se clica sobre la opción de menú y se comprueba que va a la página de login
		PO_NavView.clickOption(driver, "/desconectarse", "text",
				PO_NavView.getP().getString("login.title", PO_Properties.getSPANISH()));
		// Se comprueba que esté el menú que debe
		PO_NavView.checkMenuNotBeingInLogged(driver);
	}

	// PR09. Comprobar que el botón de logout no está disponible si el usuario no
	// está
	// autenticado
	@Test
	public void PR09() {
		// Se comprueba que no aparezca ya que aún no se está autenticado
		PO_NavView.checkLogOutNotAppear(driver);
	}

	// PR10. Mostrar el listado de usuarios y comprobar que se muestran todos los
	// que existen
	@Test
	public void PR10() {
		// Primero se inicia sesión como usuario admin
		PO_LoginView.inicioDeSesionAdmin(driver);
		// Se clica sobre la opción de menú y se comprueba que se carga
		PO_PrivateAdminView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.showUsers", PO_Properties.getSPANISH()));
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "userListId", PO_View.getTimeout());
		// Se comprueba que coincidan con los emails que debería haber
		List<String> emails = new ArrayList<String>();
		emails.add("prueba@gmail.com");
		emails.add("prueba2@gmail.com");
		emails.add("prueba3@gmail.com");
		emails.add("prueba4@gmail.com");
		emails.add("prueba5@gmail.com");
		emails.add("prueba6@gmail.com");
		emails.add("admin@email.com");
		PO_PrivateAdminView.checkUsersInList(driver, emails);
	}

	// PR11. Ir a la lista de usuarios y borrar el primero de la lista
	@Test
	public void PR11() {
		// Primero se inicia sesión como usuario admin
		PO_LoginView.inicioDeSesionAdmin(driver);
		// Se clica sobre la opción de menú y se comprueba que se carga
		PO_PrivateAdminView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.showUsers", PO_Properties.getSPANISH()));
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "userListId", PO_View.getTimeout());
		// Se solicitar borrar el primero y se comprueba que se haya borrado
		PO_PrivateAdminView.borrarUsuariosPorPosicion(driver, PO_PrivateAdminView.PRIMERO_LISTA);
	}

	// PR12. Ir a la lista de usuarios y borrar el último de la lista
	@Test
	public void PR12() {
		// Primero se inicia sesión como usuario admin
		PO_LoginView.inicioDeSesionAdmin(driver);
		// Se clica sobre la opción de menú y se comprueba que se carga
		PO_PrivateAdminView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.showUsers", PO_Properties.getSPANISH()));
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "userListId", PO_View.getTimeout());
		// Se solicitar borrar el ultimo y se comprueba que se haya borrado
		PO_PrivateAdminView.borrarUsuariosPorPosicion(driver, PO_PrivateAdminView.ULTIMO_LISTA);
	}

	// PR13. Ir a la lista de usuarios y borrar tres usuarios
	@Test
	public void PR13() {
		// Primero se inicia sesión como usuario admin
		PO_LoginView.inicioDeSesionAdmin(driver);
		// Se clica sobre la opción de menú y se comprueba que se carga
		PO_PrivateAdminView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.showUsers", PO_Properties.getSPANISH()));
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "userListId", PO_View.getTimeout());
		// Se solicitar borrar tres usuarios y se comprueba que se hayan borrado
		// Se solicitan borrar las posiciones 2, 3 y la última
		Integer[] posicionesABorrar = { 1, 2, PO_PrivateAdminView.ULTIMO_LISTA };
		PO_PrivateAdminView.borrarUsuariosPorPosicion(driver, posicionesABorrar);
	}

	// PR14. Alta de oferta con datos válidos y comprobación en listado del usuario
	@Test
	public void PR14() {
		// Primero se inicia sesión como usuario estándar
		PO_LoginView.inicioDeSesionUser(driver, "prueba2@gmail.com", "123456");
		// Se clica sobre la opción de menú y se comprueba que se carga
		PO_PrivateUserView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.addOffer", PO_Properties.getSPANISH()));
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "addOfferId", PO_View.getTimeout());
		// Se rellena con datos válidos y se crea
		PO_PrivateUserView.fillForm(driver, "Producto prueba", "Hecho con Selenium", "12-05-2016", "5.40", false);
		// Se comprueba que aparece en el listado de ofertas del usuario
		PO_PrivateUserView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.showOffers", PO_Properties.getSPANISH()));
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto prueba", PO_View.getTimeout());
	}

	// PR15. Alta de oferta con datos inválidos (título vacío)
	@Test
	public void PR15() {
		// Primero se inicia sesión como usuario estándar
		PO_LoginView.inicioDeSesionUser(driver, "prueba2@gmail.com", "123456");
		// Se clica sobre la opción de menú y se comprueba que se carga
		PO_PrivateUserView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.addOffer", PO_Properties.getSPANISH()));
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "addOfferId", PO_View.getTimeout());
		// Se rellena con datos inválidos y se crea
		PO_PrivateUserView.fillForm(driver, " ", "Hecho con Selenium", "12-05-2016", "5.40", false);
		// Se comprueba que aparece el mensaje de campo vacío
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver,
				PO_View.getP().getString("Error.empty", PO_Properties.getSPANISH()), PO_View.getTimeout());
	}

	// PR16. Mostrar listado de ofertas del usuario y comprobar que están todas
	@Test
	public void PR16() {
		// Primero se inicia sesión como usuario estándar
		PO_LoginView.inicioDeSesionUser(driver, "prueba2@gmail.com", "123456");
		// Se clica sobre la opción de menú
		PO_PrivateUserView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.showOffers", PO_Properties.getSPANISH()));
		// Se comprueba cada una de las ofertas
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 4", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 5", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 6", PO_View.getTimeout());
	}

	// PR17. Ir a la lista de ofertas y borrar la primera de ellas
	@Test
	public void PR17() {
		// Primero se inicia sesión como usuario estándar
		PO_LoginView.inicioDeSesionUser(driver, "prueba2@gmail.com", "123456");
		// Se clica sobre la opción de menú
		PO_PrivateUserView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.showOffers", PO_Properties.getSPANISH()));
		// Se eliminar la primera oferta y se comprueba que no esté
		PO_PrivateUserView.borrarProductosPorPosicion(driver, 0);
	}

	// PR18. Ir a la lista de ofertas y borrar la ultima de ellas
	@Test
	public void PR18() {
		// Primero se inicia sesión como usuario estándar
		PO_LoginView.inicioDeSesionUser(driver, "prueba2@gmail.com", "123456");
		// Se clica sobre la opción de menú
		PO_PrivateUserView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.showOffers", PO_Properties.getSPANISH()));
		// Se eliminar la última oferta y se comprueba que no esté
		PO_PrivateUserView.borrarProductosPorPosicion(driver, PO_PrivateUserView.ULTIMA_POSICION);
	}

	// PR19. Hacer búsqueda con campo vacío y ver que se muestran las que deben
	@Test
	public void PR19() {
		// Primero se inicia sesión como usuario estándar (prueba5@gmail.com)
		PO_LoginView.inicioDeSesionUser(driver, "prueba5@gmail.com", "123456");
		// Se clica sobre la opción de menú
		PO_PrivateUserView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.searchOffers", PO_Properties.getSPANISH()));
		// Sólo deberían aparecer cinco ofertas en la primera página
		int totalEncontrado = PO_PrivateUserView.buscarProductos(driver, "");
		assertTrue("Se esperaban 5 productos en la primera página ha habido " + totalEncontrado, totalEncontrado == 5);
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 1", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 10", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 11", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 12", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 16", PO_View.getTimeout());
		driver.findElement(By.id("2pag")).click(); // Se va a página 2
		// Sólo deberían aparecer otras 5 en la segunda página
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 17", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 18", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 2", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 3", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 4", PO_View.getTimeout());
		driver.findElement(By.id("3pag")).click(); // Se va a página 3
		// Sólo deberían aparecer 5 ofertas en la última página
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 5", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 6", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 7", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 8", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 9", PO_View.getTimeout());
	}

	// PR20. Hacer búsqueda con una cadena que no exista y comprobar que no sale
	// nada
	@Test
	public void PR20() {
		// Primero se inicia sesión como usuario estándar (prueba5@gmail.com)
		PO_LoginView.inicioDeSesionUser(driver, "prueba5@gmail.com", "123456");
		// Se clica sobre la opción de menú
		PO_PrivateUserView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.searchOffers", PO_Properties.getSPANISH()));
		// Se realiza la búsqueda
		int totalEncontrado = PO_PrivateUserView.buscarProductos(driver, "f2344affs");
		// Se comprueba que no sale nada
		assertTrue("Se esperaban 0 productos", totalEncontrado == 0);
	}

	// PR21. Hacer búsqueda en minúsculas y ver que se muestran las que deben
	@Test
	public void PR21() {
		// Primero se inicia sesión como usuario estándar (prueba5@gmail.com)
		PO_LoginView.inicioDeSesionUser(driver, "prueba5@gmail.com", "123456");
		// Se clica sobre la opción de menú
		PO_PrivateUserView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.searchOffers", PO_Properties.getSPANISH()));
		// Sólo deberían aparecer cinco ofertas en la primera página
		int totalEncontrado = PO_PrivateUserView.buscarProductos(driver, "producto 12");
		assertTrue("Se esperaba 1 producto ha habido " + totalEncontrado, totalEncontrado == 1);
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 12", PO_View.getTimeout());
	}

	// PR22. Hacer búsqueda y comprar un producto que deje saldo positivo
	@Test
	public void PR22() {
		// Primero se inicia sesión como usuario estándar (prueba5@gmail.com)
		PO_LoginView.inicioDeSesionUser(driver, "prueba5@gmail.com", "123456");
		// Se clica sobre la opción de menú
		PO_PrivateUserView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.searchOffers", PO_Properties.getSPANISH()));
		// Se realiza la búsqueda
		List<WebElement> totalEncontrado = PO_PrivateUserView.buscarProductosAComprar(driver, "4");
		// Se comprueba que sale 1 producto
		assertTrue("Se esperaban 1 productos", totalEncontrado.size() == 1);
		// Se compra el producto
		totalEncontrado.get(0).click();
		// Se comprueba el saldo en el monedero
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Cartera: 85.41€", PO_View.getTimeout());
	}

	// PR23. Hacer búsqueda y comprar un producto que deje saldo 0
	@Test
	public void PR23() {
		// Primero se inicia sesión como usuario estándar (prueba5@gmail.com)
		PO_LoginView.inicioDeSesionUser(driver, "prueba5@gmail.com", "123456");
		// Se clica sobre la opción de menú
		PO_PrivateUserView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.searchOffers", PO_Properties.getSPANISH()));
		// Se realiza la búsqueda
		List<WebElement> totalEncontrado = PO_PrivateUserView.buscarProductosAComprar(driver, "3");
		// Se comprueba que sale 1 producto
		assertTrue("Se esperaban 1 productos", totalEncontrado.size() == 1);
		// Se compra el producto
		totalEncontrado.get(0).click();
		// Se comprueba el saldo en el monedero
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Cartera: 0€", PO_View.getTimeout());
	}

	// PR24. Hacer búsqueda y comprar un producto que tenga precio mayor al saldo
	// disponible
	@Test
	public void PR24() {
		// Primero se inicia sesión como usuario estándar (prueba5@gmail.com)
		PO_LoginView.inicioDeSesionUser(driver, "prueba5@gmail.com", "123456");
		// Se clica sobre la opción de menú
		PO_PrivateUserView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.searchOffers", PO_Properties.getSPANISH()));
		// Se realiza la búsqueda
		List<WebElement> totalEncontrado = PO_PrivateUserView.buscarProductosAComprar(driver, "Producto 7");
		// Se obtiene el valor del monedero antes
		String monederoAntes = driver.findElement(By.id("navMoney")).getText();
		// Se comprueba que sale 1 producto
		assertTrue("Se esperaban 1 productos hubo " + totalEncontrado.size(), totalEncontrado.size() == 1);
		// Se compra el producto
		totalEncontrado.get(0).click();
		// Se comprueba el saldo en el monedero que debiera ser el mismo que antes
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, monederoAntes, PO_View.getTimeout());
		// Se comprueba que se ha indicado saldo insuficiente
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver,
				PO_View.getP().getString("offer.search.notmoneyenough", PO_Properties.getSPANISH()),
				PO_View.getTimeout());
	}

	// PR25. Ver listado de ofertas compradas y comprobar que están todas
	@Test
	public void PR25() {
		// Primero se inicia sesión como usuario estándar (prueba5@gmail.com)
		PO_LoginView.inicioDeSesionUser(driver, "prueba5@gmail.com", "123456");
		// Se clica sobre la opción de menú
		PO_PrivateUserView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.boughtOffers", PO_Properties.getSPANISH()));
		// Se obtiene el número de compras y se comprueba (2 deben ser)
		int totalCompras = PO_PrivateUserView.buscarCompras(driver);
		assertTrue("Deberían ser 2 compras", totalCompras == 2);
		// Se comprueba que se muestren
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 5", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 6", PO_View.getTimeout());
	}

	// PR26. Alta de oferta destacada
	@Test
	public void PR26() {
		// Primero se inicia sesión como usuario estándar
		PO_LoginView.inicioDeSesionUser(driver, "prueba2@gmail.com", "123456");
		// Se clica sobre la opción de menú y se comprueba que se carga
		PO_PrivateUserView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.addOffer", PO_Properties.getSPANISH()));
		SeleniumUtils.esperaCargaPaginaIdPresente(driver, "addOfferId", PO_View.getTimeout());
		// Se rellena con datos válidos y se crea
		PO_PrivateUserView.fillForm(driver, "Producto prueba", "Hecho con Selenium", "12-05-2016", "5.40", true);
		// Se comprueba que se han cargado correctamente los 20€
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Cartera: 80€", PO_View.getTimeout());
		// Se cierra sesión
		driver.manage().deleteAllCookies();
		driver.navigate().to(URL);
		// Se inicia como otro usuario y automáticamente carga el home donde están las
		// destacadas
		PO_LoginView.inicioDeSesionUser(driver, "prueba5@gmail.com", "123456");
		// Se comprueba que aparece en el listado de ofertas del usuario
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto prueba", PO_View.getTimeout());
	}

	// PR27. Ir a la lista de ofertas y destacar una oferta teniendo 20€ de saldo
	@Test
	public void PR27() {
		// Primero se inicia sesión como usuario estándar
		PO_LoginView.inicioDeSesionUser(driver, "prueba6@gmail.com", "123456");
		// Se comprueba que hay 20€
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Cartera: 20€", PO_View.getTimeout());
		// Se clica sobre la opción de menú
		PO_PrivateUserView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.showOffers", PO_Properties.getSPANISH()));
		// Se destaca el primero
		PO_PrivateUserView.destacarProductosPorPosicion(driver, 0, true);
		// Se comprueba que quedan 0€
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Cartera: 0€", PO_View.getTimeout());
		// Se cierra sesión
		driver.manage().deleteAllCookies();
		driver.navigate().to(URL);
		// Se inicia como otro usuario y automáticamente carga el home donde están las
		// destacadas
		PO_LoginView.inicioDeSesionUser(driver, "prueba5@gmail.com", "123456");
		// Se comprueba que aparece en el listado de ofertas del usuario
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 17", PO_View.getTimeout());
	}

	// PR28. Ir a la lista de ofertas y destacar una oferta no teniendo suficiente
	// saldo
	@Test
	public void PR28() {
		// Primero se inicia sesión como usuario estándar
		PO_LoginView.inicioDeSesionUser(driver, "prueba6@gmail.com", "123456");
		// Se comprueba que hay 20€
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Cartera: 20€", PO_View.getTimeout());
		// Se clica sobre la opción de menú
		PO_PrivateUserView.clickOpcionMenu(driver,
				PO_View.getP().getString("nav.menu.showOffers", PO_Properties.getSPANISH()));
		// Se destaca el primero
		PO_PrivateUserView.destacarProductosPorPosicion(driver, 0, true);
		// Se comprueba que quedan 0€
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Cartera: 0€", PO_View.getTimeout());
		// Se destaca el primero de nuevo ahora que hay 0€ para que salga el mensaje
		PO_PrivateUserView.destacarProductosPorPosicion(driver, 0, false);
		// Se comprueba que aparece el mensaje
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver,
				PO_View.getP().getString("offer.add.error.notMoneyEnough", PO_Properties.getSPANISH()),
				PO_View.getTimeout());
	}

	// PR29. Inicio de sesión con datos válidos (cliente REST)
	@Test
	public void PR29() {
		driver.navigate().to(URL + "/cliente.html");
		// Se comprueba que no muestra mensaje de login incorrecto
		PO_LoginView.checkFirstLoginAttemptREST(driver);
		// Se rellena el formulario con datos válidos
		PO_LoginView.fillFormREST(driver, "prueba2@gmail.com", "123456");
		// Se comprueba que está logueado
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Título", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Detalles", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Precio", PO_View.getTimeout());
	}

	// PR30. Inicio de sesión inválido con email existente y
	// contraseña incorrecta (cliente REST)
	@Test
	public void PR30() {
		driver.navigate().to(URL + "/cliente.html");
		// Se comprueba que no muestra mensaje de login incorrecto
		PO_LoginView.checkFirstLoginAttemptREST(driver);
		// Se rellena el formulario con email válido y contraseña incorrecta
		PO_LoginView.fillFormREST(driver, "prueba@gmail.com", "1234567");
		// Se comprueba que no está logueado y sigue en la página de login con el
		// mensaje de error
		PO_LoginView.checkInvalidLoginREST(driver);
	}

	// PR31. Inicio de sesión con datos válidos con campo email vacío (cliente REST)
	@Test
	public void PR31() {
		driver.navigate().to(URL + "/cliente.html");
		// Se comprueba que no muestra mensaje de login incorrecto
		PO_LoginView.checkFirstLoginAttemptREST(driver);
		// Se rellena el formulario con el email vacío
		PO_LoginView.fillFormREST(driver, "  ", "123456");
		// Se comprueba que no está logueado y sigue en la página de login con el
		// mensaje de error
		PO_LoginView.checkInvalidLoginREST(driver);
	}

	// PR32. Mostrar listado de ofertas disponibles y comprobar que se muestran
	// todas las
	// que existen excepto las del usuario autenticado
	@Test
	public void PR32() {
		driver.navigate().to(URL + "/cliente.html");
		// Primero se inicia sesión como usuario estándar (prueba5@gmail.com)
		PO_LoginView.inicioDeSesionUserREST(driver, "prueba5@gmail.com", "123456");
		// Sólo deberían aparecer 15 ofertas
		int totalEncontrado = PO_PrivateUserView.numeroProductosREST(driver);
		assertTrue("Se esperaban 15 productos ha habido " + totalEncontrado, totalEncontrado == 15);
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 1", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 10", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 11", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 12", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 16", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 17", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 18", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 2", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 3", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 4", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 5", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 6", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 7", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 8", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 9", PO_View.getTimeout());
	}

	// PR33. Sobre la lista de ofertas enviar un mensaje por primera vez a una
	// oferta
	@Test
	public void PR33() {
		driver.navigate().to(URL + "/cliente.html");
		// Primero se inicia sesión como usuario estándar (prueba5@gmail.com)
		PO_LoginView.inicioDeSesionUserREST(driver, "prueba5@gmail.com", "123456");
		// Se clica sobre el link chat del producto 7 id: 5cb9c0621754f0179460360b
		PO_PrivateUserView.clicarEnlacePorIdentificadorREST(driver, "5cb9c0621754f0179460360b_chat");
		// Se envia un mensaje
		PO_PrivateUserView.addMessageREST(driver, "mensajeTest");
		// Se comprueba que está el mensaje
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "mensajeTest", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "prueba5@gmail.com", PO_View.getTimeout());
	}

	// PR34. Sobre la lista de ofertas enviar un mensaje a una oferta con una
	// conversación ya abierta
	@Test
	public void PR34() {
		driver.navigate().to(URL + "/cliente.html");
		// Primero se inicia sesión como usuario estándar (prueba3@gmail.com)
		PO_LoginView.inicioDeSesionUserREST(driver, "prueba3@gmail.com", "123456");
		// Se clica sobre el link chat del producto 4 id: 5cb7558373269510e400fffe
		PO_PrivateUserView.clicarEnlacePorIdentificadorREST(driver, "5cb7558373269510e400fffe_chat");
		// Se comprueba que ya tiene mensajes
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Hola 34", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Buenas! 24", PO_View.getTimeout());
		// Se envia un mensaje
		PO_PrivateUserView.addMessageREST(driver, "mensajeTest");
		// Se comprueba que está el mensaje y siguen los anteriores
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "mensajeTest", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "prueba3@gmail.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Hola 34", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Buenas! 24", PO_View.getTimeout());
	}

	// PR35. Mostrar el listado de conversaciones ya abiertas
	@Test
	public void PR35() {
		driver.navigate().to(URL + "/cliente.html");
		// Primero se inicia sesión como usuario estándar (prueba5@gmail.com)
		PO_LoginView.inicioDeSesionUserREST(driver, "prueba5@gmail.com", "123456");
		// Se clica sobre el link de conversaciones
		PO_PrivateUserView.clicarEnlacePorIdentificadorREST(driver, "btnConvers");
		// Comprobar que contiene las que debe
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 2", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 13", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "prueba@gmail.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "prueba5@gmail.com", PO_View.getTimeout());
	}

	// PR36. Sobre el listado de conversaciones eliminar la primera
	@Test
	public void PR36() {
		driver.navigate().to(URL + "/cliente.html");
		// Primero se inicia sesión como usuario estándar (prueba5@gmail.com)
		PO_LoginView.inicioDeSesionUserREST(driver, "prueba5@gmail.com", "123456");
		// Se clica sobre el link de conversaciones
		PO_PrivateUserView.clicarEnlacePorIdentificadorREST(driver, "btnConvers");
		// Comprobar que contiene las que debe
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 2", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 13", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "prueba@gmail.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "prueba5@gmail.com", PO_View.getTimeout());
		// Se clica sobre el boton eliminar de la primera y se comprueba que desaparece
		PO_PrivateUserView.borrarConversacionPorPosicionREST(driver, 0);
	}

	// PR37. Sobre el listado de conversaciones eliminar la ultima
	@Test
	public void PR37() {
		driver.navigate().to(URL + "/cliente.html");
		// Primero se inicia sesión como usuario estándar (prueba5@gmail.com)
		PO_LoginView.inicioDeSesionUserREST(driver, "prueba5@gmail.com", "123456");
		// Se clica sobre el link de conversaciones
		PO_PrivateUserView.clicarEnlacePorIdentificadorREST(driver, "btnConvers");
		// Comprobar que contiene las que debe
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 2", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "Producto 13", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "prueba@gmail.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "prueba5@gmail.com", PO_View.getTimeout());
		// Se clica sobre el boton eliminar de la ultima y se comprueba que desaparece
		PO_PrivateUserView.borrarConversacionPorPosicionREST(driver, PO_PrivateUserView.ULTIMA_POSICION);
	}

	// PR38. Comprobar que mensaje enviado pasa a leido cuando el receptor lo recibe
	@Test
	public void PR38() {
		driver.navigate().to(URL + "/cliente.html");
		// Primero se inicia sesión como usuario estándar (prueba5@gmail.com)
		PO_LoginView.inicioDeSesionUserREST(driver, "prueba5@gmail.com", "123456");
		// Se clica sobre el link chat del producto 7 id: 5cb9c0621754f0179460360b
		PO_PrivateUserView.clicarEnlacePorIdentificadorREST(driver, "5cb9c0621754f0179460360b_chat");
		// Se envia un mensaje
		PO_PrivateUserView.addMessageREST(driver, "mensajeTest");
		// Se comprueba que está el mensaje
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "mensajeTest", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "prueba5@gmail.com", PO_View.getTimeout());
		// Se comprueba que no aparece como leido
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "leido", PO_View.getTimeout());
		// Se sale de sesión
		PO_PrivateUserView.clicarEnlacePorIdentificadorREST(driver, "btnDescon");
		// Se inicia sesión como el receptor de la oferta (prueba3@gmail.com)
		PO_LoginView.inicioDeSesionUserREST(driver, "prueba3@gmail.com", "123456");
		// Se clica sobre el link de conversaciones
		PO_PrivateUserView.clicarEnlacePorIdentificadorREST(driver, "btnConvers");
		// Se busca aquella que no coincida con el id de referencia de fila
		// 5cb9ce733900533dc0930e21 o 5cb9ce733900533dc0930e22 que son las que ya
		// estaban
		String[] existentes = { "5cb9ce733900533dc0930e21", "5cb9ce733900533dc0930e22" };
		String idConverNew = PO_PrivateUserView.obtenerIdentificadorNuevaConversacionREST(driver, existentes);
		// Se clica sobre la opción de chat de la conversacion nueva
		PO_PrivateUserView.clicarEnlacePorIdentificadorREST(driver, idConverNew + "_chat");
		// Se comprueba que esta el mensaje enviado
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "mensajeTest", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "prueba5@gmail.com", PO_View.getTimeout());
		// Se sale de sesión para volver a entrar como el remitente
		PO_PrivateUserView.clicarEnlacePorIdentificadorREST(driver, "btnDescon");
		// Se inicia sesión como usuario estándar (prueba5@gmail.com)
		PO_LoginView.inicioDeSesionUserREST(driver, "prueba5@gmail.com", "123456");
		// Se clica sobre el link chat del producto 7 id: 5cb9c0621754f0179460360b
		PO_PrivateUserView.clicarEnlacePorIdentificadorREST(driver, "5cb9c0621754f0179460360b_chat");
		// Se comprueba que está el mensaje enviado anteriormente y que sale un leido
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "mensajeTest", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "prueba5@gmail.com", PO_View.getTimeout());
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "leido", PO_View.getTimeout());
	}

	// PR39. Comprobar que el numero de mensajes sin leer se muestra correctamente
	@Test
	public void PR39() {
		driver.navigate().to(URL + "/cliente.html");
		// Primero se inicia sesión como usuario estándar (prueba5@gmail.com)
		PO_LoginView.inicioDeSesionUserREST(driver, "prueba5@gmail.com", "123456");
		// Se clica sobre el link chat del producto 7 id: 5cb9c0621754f0179460360b
		PO_PrivateUserView.clicarEnlacePorIdentificadorREST(driver, "5cb9c0621754f0179460360b_chat");
		// Se envían tres mensajes y se comprueba que esten
		PO_PrivateUserView.addMessageREST(driver, "mensajeTest1");
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "mensajeTest1", PO_View.getTimeout());
		PO_PrivateUserView.addMessageREST(driver, "mensajeTest2");
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "mensajeTest2", PO_View.getTimeout());
		PO_PrivateUserView.addMessageREST(driver, "mensajeTest3");
		SeleniumUtils.EsperaCargaPaginaTieneTexto(driver, "mensajeTest3", PO_View.getTimeout());
		// Se comprueba que no aparecen como leido
		SeleniumUtils.EsperaCargaPaginaNoTexto(driver, "leido", PO_View.getTimeout());
		// Se sale de sesión
		PO_PrivateUserView.clicarEnlacePorIdentificadorREST(driver, "btnDescon");
		// Se inicia sesión como el receptor de la oferta (prueba3@gmail.com)
		PO_LoginView.inicioDeSesionUserREST(driver, "prueba3@gmail.com", "123456");
		// Se clica sobre el link de conversaciones
		PO_PrivateUserView.clicarEnlacePorIdentificadorREST(driver, "btnConvers");
		// Se busca aquella que no coincida con el id de referencia de fila
		// 5cb9ce733900533dc0930e21 o 5cb9ce733900533dc0930e22 que son las que ya
		// estaban
		String[] existentes = { "5cb9ce733900533dc0930e21", "5cb9ce733900533dc0930e22" };
		String idConverNew = PO_PrivateUserView.obtenerIdentificadorNuevaConversacionREST(driver, existentes);
		// Se comprueba que aparece el numero 3
		String valor = PO_PrivateUserView.obtenerValorEtiquetaREST(driver, idConverNew + "_converCantidad");
		assertTrue("No sale el valor", valor.equals("3"));
	}

}