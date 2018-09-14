const phpSerialize = mixedValue => {
  var val, key, okey;
  var ktype = "";
  var vals = "";
  var count = 0;

  var _utf8Size = function(str) {
    return ~-encodeURI(str).split(/%..|./).length;
  };

  var _getType = function(inp) {
    var match;
    var key;
    var cons;
    var types;
    var type = typeof inp;

    if (type === "object" && !inp) {
      return "null";
    }

    if (type === "object") {
      if (!inp.constructor) {
        return "object";
      }
      cons = inp.constructor.toString();
      match = cons.match(/(\w+)\(/);
      if (match) {
        cons = match[1].toLowerCase();
      }
      types = ["boolean", "number", "string", "array"];
      for (key in types) {
        if (cons === types[key]) {
          type = types[key];
          break;
        }
      }
    }
    return type;
  };

  var type = _getType(mixedValue);

  switch (type) {
    case "function":
      val = "";
      break;
    case "boolean":
      val = "b:" + (mixedValue ? "1" : "0");
      break;
    case "number":
      val = (Math.round(mixedValue) === mixedValue ? "i" : "d") + ":" + mixedValue;
      break;
    case "string":
      val = "s:" + _utf8Size(mixedValue) + ':"' + mixedValue + '"';
      break;
    case "array":
    case "object":
      val = "a";

      for (key in mixedValue) {
        if (mixedValue.hasOwnProperty(key)) {
          ktype = _getType(mixedValue[key]);
          if (ktype === "function") {
            continue;
          }

          okey = key.match(/^[0-9]+$/) ? parseInt(key, 10) : key;
          vals += phpSerialize(okey) + phpSerialize(mixedValue[key]);
          count++;
        }
      }
      val += ":" + count + ":{" + vals + "}";
      break;
    case "undefined":
    default:
      val = "N";
      break;
  }
  if (type !== "object" && type !== "array") {
    val += ";";
  }

  return val;
};

const phpUnserialize = data => {
  var $global = typeof window !== "undefined" ? window : global;

  var utf8Overhead = function(str) {
    var s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
      var code = str.charCodeAt(i);
      if (code > 0x7f && code <= 0x7ff) {
        s++;
      } else if (code > 0x7ff && code <= 0xffff) {
        s += 2;
      }
      // trail surrogate
      if (code >= 0xdc00 && code <= 0xdfff) {
        i--;
      }
    }
    return s - 1;
  };
  var error = function(type, msg, filename, line) {
    throw new $global[type](msg, filename, line);
  };
  var readUntil = function(data, offset, stopchr) {
    var i = 2;
    var buf = [];
    var chr = data.slice(offset, offset + 1);

    while (chr !== stopchr) {
      if (i + offset > data.length) {
        error("Error", "Invalid");
      }
      buf.push(chr);
      chr = data.slice(offset + (i - 1), offset + i);
      i += 1;
    }
    return [buf.length, buf.join("")];
  };
  var readChrs = function(data, offset, length) {
    var i, chr, buf;

    buf = [];
    for (i = 0; i < length; i++) {
      chr = data.slice(offset + (i - 1), offset + i);
      buf.push(chr);
      length -= utf8Overhead(chr);
    }
    return [buf.length, buf.join("")];
  };
  function _unserialize(data, offset) {
    var dtype;
    var dataoffset;
    var keyandchrs;
    var keys;
    var contig;
    var length;
    var array;
    var readdata;
    var readData;
    var ccount;
    var stringlength;
    var i;
    var key;
    var kprops;
    var kchrs;
    var vprops;
    var vchrs;
    var value;
    var chrs = 0;
    var typeconvert = function(x) {
      return x;
    };

    if (!offset) {
      offset = 0;
    }
    dtype = data.slice(offset, offset + 1).toLowerCase();

    dataoffset = offset + 2;

    switch (dtype) {
      case "i":
        typeconvert = function(x) {
          return parseInt(x, 10);
        };
        readData = readUntil(data, dataoffset, ";");
        chrs = readData[0];
        readdata = readData[1];
        dataoffset += chrs + 1;
        break;
      case "b":
        typeconvert = function(x) {
          return parseInt(x, 10) !== 0;
        };
        readData = readUntil(data, dataoffset, ";");
        chrs = readData[0];
        readdata = readData[1];
        dataoffset += chrs + 1;
        break;
      case "d":
        typeconvert = function(x) {
          return parseFloat(x);
        };
        readData = readUntil(data, dataoffset, ";");
        chrs = readData[0];
        readdata = readData[1];
        dataoffset += chrs + 1;
        break;
      case "n":
        readdata = null;
        break;
      case "s":
        ccount = readUntil(data, dataoffset, ":");
        chrs = ccount[0];
        stringlength = ccount[1];
        dataoffset += chrs + 2;

        readData = readChrs(data, dataoffset + 1, parseInt(stringlength, 10));
        chrs = readData[0];
        readdata = readData[1];
        dataoffset += chrs + 2;
        if (chrs !== parseInt(stringlength, 10) && chrs !== readdata.length) {
          error("SyntaxError", "String length mismatch");
        }
        break;
      case "a":
        readdata = {};

        keyandchrs = readUntil(data, dataoffset, ":");
        chrs = keyandchrs[0];
        keys = keyandchrs[1];
        dataoffset += chrs + 2;

        length = parseInt(keys, 10);
        contig = true;

        for (i = 0; i < length; i++) {
          kprops = _unserialize(data, dataoffset);
          kchrs = kprops[1];
          key = kprops[2];
          dataoffset += kchrs;

          vprops = _unserialize(data, dataoffset);
          vchrs = vprops[1];
          value = vprops[2];
          dataoffset += vchrs;

          if (key !== i) {
            contig = false;
          }

          readdata[key] = value;
        }

        if (contig) {
          array = new Array(length);
          for (i = 0; i < length; i++) {
            array[i] = readdata[i];
          }
          readdata = array;
        }

        dataoffset += 1;
        break;
      default:
        error("SyntaxError", "Unknown / Unhandled data type(s): " + dtype);
        break;
    }
    return [dtype, dataoffset - offset, typeconvert(readdata)];
  }

  return _unserialize(data + "", 0)[2];
};

export { phpSerialize, phpUnserialize };
