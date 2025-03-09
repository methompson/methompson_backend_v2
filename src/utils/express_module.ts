import { application, Application, Router } from 'express';
import { isString } from 'tcheck';

export class ExpressModule {
  constructor(
    protected _router: Router,
    protected _prefix: string = '',
  ) {
    if (encodeURIComponent(_prefix) !== _prefix) {
      throw new Error('Invalid prefix');
    }
  }

  get prefix() {
    return this._prefix;
  }
  get router() {
    return this._router;
  }
}

export class ExpressApp {
  protected _use: typeof application.prototype.use;
  protected _listen: typeof application.prototype.listen;

  constructor(protected _app: Application) {
    this._use = _app.use;
    this._listen = _app.listen;
  }

  get use() {
    return this._use;
  }
  get listen() {
    return this._listen;
  }

  addModule(module: ExpressModule) {
    if (isString(module.prefix) && module.prefix.length > 0) {
      this._app.use(module.prefix, module.router);
    } else {
      this._app.use(module.router);
    }
  }
}
