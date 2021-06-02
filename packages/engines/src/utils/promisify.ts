
export function promisify(cb: any, fn: (cb: any) => void): Promise<any> {
  return new Promise((resolve, reject) => {
    cb = cb || function(err: any, html: string) {
      if (err) {
        return reject(err);
      }
      resolve(html);
    };

    fn(cb);
  });
}