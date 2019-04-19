package com.uniovi.tests.pageobjects;

import java.io.UnsupportedEncodingException;
import java.util.Locale;
import java.util.ResourceBundle;

public class PO_Properties {

	static private String Path;
	static int SPANISH = 0;
	static Locale[] idioms = new Locale[] { new Locale("ES") };

	public PO_Properties(String Path) {
		PO_Properties.Path = Path;
	}

	public static int getSPANISH() {
		return SPANISH;
	}

	/**
	 * Obtiene el valor para una propiedad en el idioma indicado
	 * 
	 * @param prop   nombre de la propiedad
	 * @param locale idioma
	 * @return el valor
	 */
	public String getString(String prop, int locale) {
		ResourceBundle bundle = ResourceBundle.getBundle(Path, idioms[locale]);
		String value = bundle.getString(prop);
		String result = "";
		try {
			result = new String(value.getBytes("ISO-8859-1"), "UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return result;
	}

}
