/**
 * Utilidad para implementar un sistema de caché en memoria para datos frecuentemente utilizados
 * Esto mejora el rendimiento al evitar cargar los mismos datos repetidamente
 */

// Tipo para los elementos en caché
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number; 
}


class LocalCache {
  private static cache: Record<string, CacheItem<any>> = {};

  /**
   * Guarda un valor en caché
   * @param key Clave para identificar el valor
   * @param data Datos a almacenar
   * @param ttl Tiempo de vida en segundos (por defecto 5 minutos)
   */
  static set<T>(key: string, data: T, ttl: number = 300): void {
    const timestamp = Date.now();
    const expiry = timestamp + ttl * 1000;

    this.cache[key] = {
      data,
      timestamp,
      expiry,
    };

    
    try {
      localStorage.setItem(
        `cache_${key}`,
        JSON.stringify({
          data,
          timestamp,
          expiry,
        })
      );
    } catch (e) {
      console.warn("Error al guardar en localStorage:", e);
    }
  }

  /**
   * Obtiene un valor del caché
   * @param key Clave del valor a obtener
   * @returns El valor almacenado o null si no existe o ha expirado
   */
  static get<T>(key: string): T | null {
    
    const item = this.cache[key];

    
    if (!item) {
      try {
        const storedItem = localStorage.getItem(`cache_${key}`);
        if (storedItem) {
          const parsed = JSON.parse(storedItem) as CacheItem<T>;

          if (parsed.expiry > Date.now()) {
            this.cache[key] = parsed;
            return parsed.data;
          } else {
            localStorage.removeItem(`cache_${key}`);
          }
        }
      } catch (e) {
        console.warn("Error al leer de localStorage:", e);
      }
      return null;
    }

    // Verificar si el elemento en memoria ha expirado
    if (item.expiry < Date.now()) {
      delete this.cache[key];
      try {
        localStorage.removeItem(`cache_${key}`);
      } catch (e) {
        console.warn("Error al eliminar de localStorage:", e);
      }
      return null;
    }

    return item.data;
  }

  /**
   * Elimina un valor del caché
   * @param key Clave del valor a eliminar
   */
  static remove(key: string): void {
    delete this.cache[key];
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (e) {
      console.warn("Error al eliminar de localStorage:", e);
    }
  }

  /**
   * Limpia todos los valores caducados del caché
   */
  static clearExpired(): void {
    const now = Date.now();

    
    Object.keys(this.cache).forEach((key) => {
      if (this.cache[key].expiry < now) {
        delete this.cache[key];
      }
    });

    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("cache_")) {
          const value = localStorage.getItem(key);
          if (value) {
            const item = JSON.parse(value) as CacheItem<any>;
            if (item.expiry < now) {
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch (e) {
      console.warn("Error al limpiar localStorage:", e);
    }
  }
}

export default LocalCache;
