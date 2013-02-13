
sjcl.beware["CBC mode is dangerous because it doesn't protect message integrity."]();

function gombot_addEntropy(data, numBits, source) {
    sjcl.random.addEntropy(data, numBits, source);
}

// strings are managed as sjcl.bitArray most everywhere.
// sjcl.bitArray.concat(a,b) works, but a.concat(b) does not.
// sjcl.bitArray.bitSlice(a, start, end) works, but is indexed by bit, not by
// byte.
//
//  bits = sjcl.codec.utf8String.toBits(string)
//  b64str = sjcl.codec.base64.fromBits(bits)

function assertBits(a) {
    if (!a.__prototype__ === sjcl.bitArray) {
        console.log("Hey, non-bitArray '"+a+"'");
        alert("Hey, non-bitArray '"+a+"'");
    }
}

var concatBits = sjcl.bitArray.concat;
var str2bits = sjcl.codec.utf8String.toBits;
var bits2str = sjcl.codec.utf8String.fromBits;
var bits2b64 = sjcl.codec.base64.fromBits;
var b642bits = sjcl.codec.base64.toBits;
var bits2hex = sjcl.codec.hex.fromBits;
var hex2bits = sjcl.codec.hex.toBits;
function sliceBits(bits, start, end) { // byte offsets
    return sjcl.bitArray.bitSlice(bits, 8*start, 8*end);
}
function logBits(name, bits) {
    console.log(name, bits2hex(bits), sjcl.bitArray.bitLength(bits));
}

function makeSalt(name_str, extra) {
    var out = str2bits("identity.mozilla.com/gombot/v1/");
    out = concatBits(out, str2bits(name_str));
    if (extra) {
        assertBits(extra);
        out = concatBits(out, str2bits(":"));
        out = concatBits(out, extra);
    }
    return out;
}

function gombot_kdf(email_str, password_str) {
    var masterSalt = makeSalt("master", str2bits(email_str));
    var secret = str2bits("");
    var masterSecret = concatBits(concatBits(secret, str2bits(":")),
                                  str2bits(password_str));
    //logBits("masterSalt", masterSalt);
    //logBits("masterSecret", masterSecret);
    // sjcl's PBKDF2 defaults to HMAC-SHA256
    var masterKey = sjcl.misc.pbkdf2(masterSecret, masterSalt, 250*1000, 8*32);
    //logBits("masterKey", masterKey);
    var authKey = sjcl.misc.pbkdf2(masterKey, makeSalt("authentication"), 1, 8*32);
    var aesKey = sjcl.misc.pbkdf2(masterKey, makeSalt("data/AES"), 1, 8*32);
    var hmacKey = sjcl.misc.pbkdf2(masterKey, makeSalt("data/HMAC"), 1, 8*32);
    // return an object that can be serialized as JSON for storage. We'll
    // have to convert it back to an sjcl.bitArray before using it.
    return {masterKey: bits2hex(masterKey),
            authKey: bits2hex(authKey),
            aesKey: bits2hex(aesKey),
            hmacKey: bits2hex(hmacKey)};
}


var gombot_version_prefix = str2bits("identity.mozilla.com/gombot/v1/data:");

/* keys= is the {aesKey: hex, hmacKey: hex} output of gombot_kdf()
 * data= is a string (probably the output of JSON.stringify)
 * forceIV= is usually null, but tests can provide an sjcl.bitArray
 *
 * we return a base64-encoded string.
 */
function gombot_encrypt(keys, data, forceIV) {
    if (!sjcl.random.isReady())
        throw new Error("sjcl.random is not ready, cannot create IV");
    var IV = sjcl.random.randomWords(16/4);
    if (forceIV)
        IV = hex2bits(forceIV);

    var ct = sjcl.mode.cbc.encrypt(new sjcl.cipher.aes(hex2bits(keys.aesKey)),
                                   str2bits(data), IV);
    var msg = concatBits(concatBits(gombot_version_prefix, IV), ct);
    var mac = new sjcl.misc.hmac(hex2bits(keys.hmacKey), sjcl.hash.sha256).mac(msg);
    //logBits("mac", mac);
    var msgmac = concatBits(msg, mac);
    //console.log(bits2hex(IV), bits2hex(msg), bits2hex(mac));
    return bits2b64(msgmac);
}

/* keys= is the {aesKey: hex, hmacKey: hex} output of gombot_kdf()
 * msgmac_b64= is a string, the output of gombot_encrypt()
 *
 * we return a string, probably ready for JSON.parse()
 */
function gombot_decrypt(keys, msgmac_b64) {
    var bA = sjcl.bitArray;
    var msgmac = b642bits(msgmac_b64);
    var prelen = bA.bitLength(gombot_version_prefix);
    var gotPrefix = bA.bitSlice(msgmac, 0, prelen);
    if (!bA.equal(gotPrefix, gombot_version_prefix))
        throw new Error("unrecognized version prefix '"+bits2str(gotPrefix)+"'");
    var macable = bA.bitSlice(msgmac, 0, bA.bitLength(msgmac)-32*8);
    var expectedMac = new sjcl.misc.hmac(hex2bits(keys.hmacKey),
                                         sjcl.hash.sha256).mac(macable);
    var gotMac = bA.bitSlice(msgmac, bA.bitLength(msgmac)-32*8);
    if (!bA.equal(expectedMac, gotMac)) // this is constant-time
        throw new Error("Corrupt encrypted data");
    var IV = bA.bitSlice(macable, prelen, prelen+16*8);
    var msg = bA.bitSlice(macable, prelen+16*8);
    var pt = sjcl.mode.cbc.decrypt(new sjcl.cipher.aes(hex2bits(keys.aesKey)),
                                   msg, IV);
    //logBits("pt", pt);
    return bits2str(pt);
}


// including UTF-8 in this file without declaring the charset like:
//  <script src="gombot.js" type="text/javascript" charset="UTF-8"></script>
//  causes a double-decoding (WTF-8, for those in the know).

function test() {
    var email = "andré@example.org";
    var password = "pässwörd";
    //var email = "andr\u00e9@example.org"; // ugly workaround
    //var password = "p\u00e4ssw\u00f6rd";
    //console.log(email.charCodeAt(4), 0xe9);
    if (bits2hex(str2bits(password)) != "70c3a4737377c3b67264") {
        console.log("WTF-8 PROBLEM!");
    }
    logBits("email", str2bits(email));
    logBits("password", str2bits(password));
    var data = '{"kéy": "valuë2"}';
    var start = new Date().getTime();
    var keys = gombot_kdf(email, password);
    console.log("keys", keys);
    var m_b64 = gombot_encrypt(keys, data, "45fea09e3db6333762a8c6ab8ac50548");
    console.log("msgmac_b64", m_b64);
    var end = new Date().getTime();
    console.log("elapsed", (end - start) / 1000);
    var newdata = gombot_decrypt(keys, m_b64);
    console.log("decrypted", newdata);
    console.log("decrypt roundtrip good:", newdata == data);
    return {elapsed: (end-start)/1000};
}
