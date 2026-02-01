Holaa! Excelente ejercicio :) Lo hiciste genial!
Dejamos algunos comentarios en el archivo `filter-and-search.js`, la idea es lo siguiente:

Cuando nosotros tenemos un string "javascript,react,sql", y queremos ver si el texto "javascript" se encuentra dentro de él, podemos hacerlo con un `includes("javascript")`, esto nos devolverá `true`, porque efectivamente "javascript" está dentro de "javascript,react,sql". 

Pero, si ahora queremos buscar la palabra "java" en ese mismo string, en teoría "java" no es un lenguaje válido en esa lista, pero el resultado devolverá `true`.

Esto es porque cuando usamos `includes()` en un string, lo que hacemos es verificar si el texto que buscamos se encuentra dentro de él, sin importar si es un fragmento de una palabra o la palabra completa.

Por eso para evitarlo, lo que podemos hacer es transformar ese "string" en una lista, con el método `split(',')`, lo que nos da `["javascript", "react", "sql"]`.

Ahora cuando usemos `includes()` en la lista, lo que hará es verificar si el texto que buscamos es igual al texto de uno de los campos de la lista, sin evaluar si es un fragmento de la misma.

<!-- Aquí puedes hacer preguntas -->
