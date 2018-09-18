/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

const interfaceExtensions: Array<() => void> = [];

/**
 * Registers an extension that extends the global `Mocha` implementation
 * with new helper methods. These helper methods will be added to the `window`
 * when tests run for both BDD and TDD interfaces.
 */
export function extendInterfaces(
    helperName: string,
    helperFactory: (
        context: any,
        teardown: (cb: () => void) => void,
        interfaceName: 'tdd'|'bdd') => void) {
  interfaceExtensions.push(function() {
    const Mocha = window.Mocha;
    // For all Mocha interfaces (probably just TDD and BDD):
    Object.keys((Mocha as any).interfaces)
        .forEach(function(interfaceName: 'tdd'|'bdd') {
          // This is the original callback that defines the interface (TDD or
          // BDD):
          const originalInterface = (Mocha as any).interfaces[interfaceName];
          // This is the name of the "teardown" or "afterEach" property for the
          // current interface:
          const teardownProperty =
              interfaceName === 'tdd' ? 'teardown' : 'afterEach';
          // The original callback is monkey patched with a new one that appends
          // to the global context however we want it to:
          (Mocha as any).interfaces[interfaceName] = function(suite: any) {
            // Call back to the original callback so that we get the base
            // interface:
            originalInterface.apply(this, arguments);
            // Register a listener so that we can further extend the base
            // interface:
            suite.on(
                'pre-require',
                function(context: any, _file: string, _mocha: any) {
                  // Capture a bound reference to the teardown function as a
                  // convenience:
                  const teardown = context[teardownProperty].bind(context);
                  // Add our new helper to the testing context. The helper is
                  // generated by a factory method that receives the context,
                  // the teardown function and the interface name and returns
                  // the new method to be added to that context:
                  context[helperName] =
                      helperFactory(context, teardown, interfaceName);
                });
          };
        });
  });
}

/**
 * Applies any registered interface extensions. The extensions will be applied
 * as many times as this function is called, so don't call it more than once.
 */
export function applyExtensions() {
  interfaceExtensions.forEach(function(applyExtension) {
    applyExtension();
  });
}
