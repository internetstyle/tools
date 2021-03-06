/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   paper-checked-element-behavior.html
 */

/// <reference path="../polymer/types/polymer.d.ts" />
/// <reference path="../iron-checked-element-behavior/iron-checked-element-behavior.d.ts" />
/// <reference path="paper-inky-focus-behavior.d.ts" />

declare namespace Polymer {

  /**
   * Use `Polymer.PaperCheckedElementBehavior` to implement a custom element
   * that has a `checked` property similar to `Polymer.IronCheckedElementBehavior`
   * and is compatible with having a ripple effect.
   */
  interface PaperCheckedElementBehavior extends Polymer.PaperInkyFocusBehavior, Polymer.IronCheckedElementBehavior {

    /**
     * Synchronizes the element's `active` and `checked` state.
     */
    _buttonStateChanged(): void;

    /**
     * Synchronizes the element's checked state with its ripple effect.
     */
    _checkedChanged(): void;
  }

  const PaperCheckedElementBehavior: object;
}
