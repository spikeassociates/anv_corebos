const getQs = obj =>
  obj
    ? "?" +
      Object.entries(obj)
        .map(([key, val]) => {
          const value = typeof val === "object" ? btoa(JSON.stringify(val)) : val;
          return `${key}=${encodeURIComponent(value)}`;
        })
        .join("&")
    : "";

const getUrl = url => (/^(f|ht)tps?:\/\//i.test(url) ? url : GLOBALS.BASE_API + url);

export { getQs, getUrl };
