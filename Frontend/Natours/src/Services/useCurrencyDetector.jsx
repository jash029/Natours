import { useCallback, useEffect, useState } from "react";

const DEFAULT_CONFIG = {
  currency: "USD",
  rate: 1,
  locale: "en-US",
};

const STORAGE_KEY = "currency-config";

const CURRENCY_MAP = {
  US: { currency: "USD", rate: 1, locale: "en-US" },

  IN: { currency: "INR", rate: 85, locale: "en-IN" },

  GB: { currency: "GBP", rate: 0.79, locale: "en-GB" },

  DE: { currency: "EUR", rate: 0.92, locale: "de-DE" },
  FR: { currency: "EUR", rate: 0.92, locale: "fr-FR" },
  IT: { currency: "EUR", rate: 0.92, locale: "it-IT" },
  ES: { currency: "EUR", rate: 0.92, locale: "es-ES" },
  NL: { currency: "EUR", rate: 0.92, locale: "nl-NL" },

  CA: { currency: "CAD", rate: 1.37, locale: "en-CA" },

  AU: { currency: "AUD", rate: 1.53, locale: "en-AU" },

  NZ: { currency: "NZD", rate: 1.68, locale: "en-NZ" },

  CH: { currency: "CHF", rate: 0.81, locale: "de-CH" },

  JP: { currency: "JPY", rate: 149, locale: "ja-JP" },

  SG: { currency: "SGD", rate: 1.29, locale: "en-SG" },

  AE: { currency: "AED", rate: 3.67, locale: "en-AE" },

  NO: { currency: "NOK", rate: 10.3, locale: "nb-NO" },
};

export default function useCurrencyDetector() {
  const [currencyConfig, setCurrencyConfig] = useState(() => {
    const cached = localStorage.getItem(STORAGE_KEY);

    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    return DEFAULT_CONFIG;
  });

  const [isLoading, setIsLoading] = useState(
    !localStorage.getItem(STORAGE_KEY),
  );

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    async function detectCurrency() {
      try {
        const response = await fetch("https://ipwho.is/");

        if (!response.ok) throw new Error("Failed to detect country.");

        const data = await response.json();

        const config = CURRENCY_MAP[data.country_code] ?? DEFAULT_CONFIG;

        setCurrencyConfig(config);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      } catch (err) {
        console.error("Currency detection failed:", err);

        setCurrencyConfig(DEFAULT_CONFIG);
      } finally {
        setIsLoading(false);
      }
    }

    detectCurrency();
  }, []);

  const formatCurrency = useCallback(
    (amount = 0) =>
      new Intl.NumberFormat(currencyConfig.locale, {
        style: "currency",
        currency: currencyConfig.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount * currencyConfig.rate),
    [currencyConfig],
  );

  return {
    currencyConfig,
    formatCurrency,
    isLoading,
  };
}
