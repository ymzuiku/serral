module.exports = {
  loadDir: function(dir, ...args) {
    if (typeof window !== 'undefined') {
      throw new Error('fp-loadDir need in nodejs');
    }
    const fs = require('fs-extra');
    const path = require('path');
    const stat = fs.lstatSync(dir);
    const fns = {};
    if (stat && stat.isDirectory()) {
      const files = fs.readdirSync(dir);
      for (let i = 0; i < files.length; i++) {
        const subPath = path.resolve(dir, files[i]);
        const isSubDir = fs.lstatSync(subPath).isDirectory()
        if ( isSubDir || (files[i].indexOf('.js') > -1 && files[i].indexOf('_') !== 0)) {
          let fs = files[i].replace('.js', '');
          fs = fs.replace('.jsx', '');
          const fn = require(path.resolve(dir, fs));
          if (args.length > 0) {
            fn(...args);
          } else {
            fns[fs] = fn;
          }
        }
      }
    } else {
      throw new Error(`${dir} is no directory`);
    }
    return fns;
  },
  flattenToMap: function(data, splitString = '.') {
    var end = {};
    function flattenSub(obj, oldKey = '') {
      for (var k in obj) {
        var key = oldKey ? oldKey + splitString : oldKey;
        key += k;
        if (Object.prototype.toString.call(obj[k]) === '[object Object]') {
          flattenSub(obj[k], key);
        } else {
          end[key] = obj[k];
        }
      }
    }
    if (Object.prototype.toString.call(data) === '[object Array]') {
      for (let i = 0; i < data.length; i++) {
        flattenSub(data[i]);
      }
    } else {
      flattenSub(data);
    }
    return end;
  },
};
