export default {
  ArrayToJSON: function(array2D) {
    const header = array2D[0];
    const body = array2D.slice(1);
    const arr2 = body.map((el) => {
      let obj = {};
      for (let i = 0; i < el.length; ++i) {
        obj[header[i]] = el[i];
      }
      return obj;
    });
    return arr2;
  },
};
