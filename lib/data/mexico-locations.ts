// lib/data/mexico-locations.ts
export interface MexicoState {
  name: string
  cities: string[]
}

export const MEXICO_STATES: MexicoState[] = [
  { name: 'Aguascalientes', cities: ['Aguascalientes', 'Asientos', 'Calvillo', 'Cosío', 'El Llano', 'Jesús María', 'Pabellón de Arteaga', 'Rincón de Romos', 'San Francisco de los Romo', 'Tepezalá'] },
  { name: 'Baja California', cities: ['Ensenada', 'Mexicali', 'Playas de Rosarito', 'Tecate', 'Tijuana'] },
  { name: 'Baja California Sur', cities: ['Comondú', 'La Paz', 'Loreto', 'Los Cabos', 'Mulegé'] },
  { name: 'Campeche', cities: ['Calkiní', 'Campeche', 'Carmen', 'Champotón', 'Escárcega', 'Hopelchén', 'Palizada'] },
  { name: 'Chiapas', cities: ['Comitán de Domínguez', 'Ocosingo', 'San Cristóbal de las Casas', 'Tapachula', 'Tuxtla Gutiérrez'] },
  { name: 'Chihuahua', cities: ['Chihuahua', 'Ciudad Juárez', 'Cuauhtémoc', 'Delicias', 'Hidalgo del Parral', 'Ojinaga'] },
  { name: 'Ciudad de México', cities: ['Álvaro Obregón', 'Azcapotzalco', 'Benito Juárez', 'Coyoacán', 'Cuajimalpa', 'Cuauhtémoc', 'Gustavo A. Madero', 'Iztacalco', 'Iztapalapa', 'La Magdalena Contreras', 'Miguel Hidalgo', 'Milpa Alta', 'Tláhuac', 'Tlalpan', 'Venustiano Carranza', 'Xochimilco'] },
  { name: 'Coahuila', cities: ['Monclova', 'Piedras Negras', 'Saltillo', 'Torreón'] },
  { name: 'Colima', cities: ['Armería', 'Colima', 'Comala', 'Coquimatlán', 'Cuauhtémoc', 'Ixtlahuacán', 'Manzanillo', 'Minatitlán', 'Tecomán', 'Villa de Álvarez'] },
  { name: 'Durango', cities: ['Durango', 'Gómez Palacio', 'Lerdo', 'Victoria de Durango'] },
  { name: 'Estado de México', cities: ['Atizapán de Zaragoza', 'Coacalco', 'Cuautitlán Izcalli', 'Ecatepec', 'Huixquilucan', 'Ixtapaluca', 'Naucalpan', 'Netzahualcóyotl', 'Nicolás Romero', 'Tecámac', 'Texcoco', 'Tlalnepantla', 'Toluca', 'Tultitlán', 'Valle de Chalco'] },
  { name: 'Guanajuato', cities: ['Celaya', 'Guanajuato', 'Irapuato', 'León', 'Salamanca', 'San Miguel de Allende', 'Silao'] },
  { name: 'Guerrero', cities: ['Acapulco', 'Chilpancingo', 'Iguala', 'Taxco', 'Zihuatanejo'] },
  { name: 'Hidalgo', cities: ['Pachuca', 'Tizayuca', 'Tula de Allende', 'Tulancingo'] },
  { name: 'Jalisco', cities: ['El Salto', 'Guadalajara', 'Puerto Vallarta', 'Tlaquepaque', 'Tlajomulco', 'Tonalá', 'Zapopan', 'Zapotlán el Grande'] },
  { name: 'Michoacán', cities: ['Lázaro Cárdenas', 'Morelia', 'Uruapan', 'Zamora', 'Zitácuaro'] },
  { name: 'Morelos', cities: ['Cuernavaca', 'Cuautla', 'Jiutepec', 'Temixco', 'Yautepec'] },
  { name: 'Nayarit', cities: ['Bahía de Banderas', 'Tepic', 'Xalisco'] },
  { name: 'Nuevo León', cities: ['Apodaca', 'Cadereyta Jiménez', 'García', 'General Escobedo', 'Guadalupe', 'Juárez', 'Monterrey', 'San Nicolás de los Garza', 'San Pedro Garza García', 'Santa Catarina'] },
  { name: 'Oaxaca', cities: ['Oaxaca de Juárez', 'Puerto Escondido', 'Salina Cruz', 'San Juan Bautista Tuxtepec'] },
  { name: 'Puebla', cities: ['Cholula', 'Puebla', 'San Martín Texmelucan', 'Tehuacán', 'Teziutlán'] },
  { name: 'Querétaro', cities: ['El Marqués', 'Corregidora', 'Querétaro', 'San Juan del Río'] },
  { name: 'Quintana Roo', cities: ['Benito Juárez (Cancún)', 'Cozumel', 'Felipe Carrillo Puerto', 'Isla Mujeres', 'Othón P. Blanco (Chetumal)', 'Solidaridad (Playa del Carmen)', 'Tulum'] },
  { name: 'San Luis Potosí', cities: ['Ciudad Valles', 'Matehuala', 'San Luis Potosí', 'Soledad de Graciano Sánchez'] },
  { name: 'Sinaloa', cities: ['Ahome (Los Mochis)', 'Culiacán', 'Guasave', 'Mazatlán'] },
  { name: 'Sonora', cities: ['Cajeme (Ciudad Obregón)', 'Guaymas', 'Hermosillo', 'Nogales', 'San Luis Río Colorado'] },
  { name: 'Tabasco', cities: ['Cárdenas', 'Centro (Villahermosa)', 'Comalcalco', 'Macuspana', 'Paraíso'] },
  { name: 'Tamaulipas', cities: ['Altamira', 'Ciudad Madero', 'Ciudad Victoria', 'Matamoros', 'Nuevo Laredo', 'Reynosa', 'Tampico'] },
  { name: 'Tlaxcala', cities: ['Apizaco', 'Chiautempan', 'Tlaxcala', 'Zacatelco'] },
  { name: 'Veracruz', cities: ['Boca del Río', 'Coatzacoalcos', 'Córdoba', 'Minatitlán', 'Orizaba', 'Poza Rica', 'Veracruz', 'Xalapa'] },
  { name: 'Yucatán', cities: ['Kanasín', 'Mérida', 'Progreso', 'Valladolid'] },
  { name: 'Zacatecas', cities: ['Fresnillo', 'Guadalupe', 'Zacatecas'] },
]
