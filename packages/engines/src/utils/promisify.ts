export function promisify(cb: any, fn: (cb: any) => void): Promise<any> {
  return new Promise((resolve, reject) => {
    cb =
      cb ||
      ((err: any, html: string) => {
        err ? reject(err) : resolve(html);
      });

    fn(cb);
  });
}
