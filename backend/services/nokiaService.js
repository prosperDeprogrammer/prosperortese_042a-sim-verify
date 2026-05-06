const axios = require('axios');
const https = require('https');

// Connection pooling: reuse TCP/TLS connections to RapidAPI
const agent = new https.Agent({
  keepAlive: true,
  maxSockets: 10,
  timeout: 60000
});

/**
 * NOKIA NETWORK-AS-CODE (CAMARA) SERVICE
 *
 * Calls RapidAPI → Nokia passthrough. Each field in the result is the JSON body
 * returned by that endpoint (or the same body on HTTP error when Nokia sends JSON).
 */

// Simple in-memory cache for demo performance (15s TTL)
const cache = new Map();
const CACHE_TTL = 15000;

/** Shape like axios so callers can use res.data */
function toErrorPayload(err) {
  if (err.response && err.response.data !== undefined) {
    return { data: err.response.data };
  }
  return {
    data: {
      error: err.message,
      code: err.code,
      httpStatus: err.response?.status
    }
  };
}

/** Avoid axios ERR_INVALID_URL — that JSON is from Node, not Nokia. */
function requireEnvUrl(name) {
  const raw = process.env[name];
  const s = typeof raw === 'string' ? raw.trim() : '';
  try {
    const u = new URL(s);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error();
    return s;
  } catch {
    throw new Error(
      `${name} must be a full https:// URL from your Nokia / RapidAPI subscription. Empty or invalid values produce ERR_INVALID_URL locally — not a Nokia response.`
    );
  }
}

function optionalEnvUrl(name) {
  const raw = process.env[name];
  const s = typeof raw === 'string' ? raw.trim() : '';
  if (!s) return null;
  return requireEnvUrl(name);
}

async function getNetworkSignals(phoneNumber, locationData = null) {
  const cacheKey = phoneNumber;
  const now = Date.now();

  if (cache.has(cacheKey) && (now - cache.get(cacheKey).timestamp < CACHE_TTL)) {
    return cache.get(cacheKey).data;
  }


  const apiKey = process.env.NAC_API_KEY;
  const apiHost = process.env.NAC_RAPIDAPI_HOST || 'network-as-code.p.rapidapi.com';
  const timeout = parseInt(process.env.NAC_TIMEOUT_MS) || 8000;

  const mockNumberVerification = process.env.NAC_MOCK_NUMBER_VERIFICATION === 'true';
  const numberVerifyUrl = mockNumberVerification
    ? optionalEnvUrl('NAC_NUMBER_VERIFY_URL')
    : requireEnvUrl('NAC_NUMBER_VERIFY_URL');
  const simSwapUrl = requireEnvUrl('NAC_SIM_SWAP_URL');
  const locationVerifyUrl = optionalEnvUrl('NAC_LOCATION_VERIFY_URL');

  const headers = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': apiHost
  };

  console.log(`[NETWORK-AS-CODE] Analyzing: ${phoneNumber}`);

  // Number Verification: live call, or mock CAMARA shape when passthrough returns "API doesn't exists" on your hub
  const numberVerifyIsShare =
    numberVerifyUrl && /device-phone-number\s*$/i.test(numberVerifyUrl);

  const requests = {
    numberVerify: mockNumberVerification
      ? Promise.resolve().then(() => {
        const payload = { devicePhoneNumberVerified: true };
        console.log('[NUMBER VERIFY] MOCK (NAC_MOCK_NUMBER_VERIFICATION=true):', JSON.stringify(payload));
        return { data: payload };
      })
      : (async () => {
        if (numberVerifyIsShare) {
          console.log(`[LIVE API] GET ${numberVerifyUrl}`);
          const res = await axios.get(numberVerifyUrl, { headers, timeout, httpsAgent: agent });
          console.log(`[NOKIA RESPONSE] NumberVerify:`, JSON.stringify(res.data, null, 2));
          return res;
        }
        const body = { phoneNumber };
        console.log(`[LIVE API] POST ${numberVerifyUrl} | Payload:`, JSON.stringify(body));
        const res = await axios.post(numberVerifyUrl, body, { headers, timeout, httpsAgent: agent });
        console.log(`[NOKIA RESPONSE] NumberVerify:`, JSON.stringify(res.data, null, 2));
        return res;
      })().catch(toErrorPayload),

    simSwap: (async () => {
      const body = { phoneNumber: phoneNumber, maxAge: 240 };
      console.log(`[LIVE API] POST ${simSwapUrl} | Payload:`, JSON.stringify(body));
      const res = await axios.post(simSwapUrl, body, { headers, timeout, httpsAgent: agent });
      console.log(`[NOKIA RESPONSE] SimSwap:`, JSON.stringify(res.data, null, 2));
      return res;
    })().catch(toErrorPayload),

    locationVerify: !locationVerifyUrl
      ? Promise.resolve({
        data: {
          code: 'LOCATION_VERIFY_NOT_CONFIGURED',
          message:
            'Set NAC_LOCATION_VERIFY_URL in backend/.env to the Location Verification POST URL from RapidAPI (same hub as SIM swap).'
        }
      })
      : (async () => {
        const body = {
          device: { phoneNumber: phoneNumber },
          area: locationData?.area || {
            areaType: 'CIRCLE',
            // Default matches Nokia sandbox example (returns verificationResult TRUE for test MSISDNs)
            center: { latitude: 50.735851, longitude: 7.10066 },
            radius: 50000
          }
        };
        console.log(`[LIVE API] POST ${locationVerifyUrl} | Payload:`, JSON.stringify(body));
        const res = await axios.post(locationVerifyUrl, body, { headers, timeout, httpsAgent: agent });
        console.log(`[NOKIA RESPONSE] LocationVerify:`, JSON.stringify(res.data, null, 2));
        return res;
      })().catch(toErrorPayload)
  };

  try {
    const [numRes, swapRes, locVRes] = await Promise.all([
      requests.numberVerify,
      requests.simSwap,
      requests.locationVerify
    ]);

    const results = {
      numberVerification: numRes.data,
      simSwap: swapRes.data,
      locationVerify: locVRes.data,
      // timestamp: new Date().toISOString(),
      /** If this is missing in the Developer Console, you are not hitting this codebase (no locationRetrieve in v2). */
      // _responseBundle: 'theme5-v2-three-apis',
      // _mockNumberVerification: mockNumberVerification
    };

    cache.set(cacheKey, { timestamp: now, data: results });
    return results;

  } catch (err) {
    console.error('[NOKIA SERVICE ERROR]', err.message);
    throw err;
  }
}



module.exports = { getNetworkSignals };
