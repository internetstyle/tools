/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
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

// jshint node: true
'use strict';

import constants from './constants';
import {predicates} from 'dom5';
import * as parse5 from 'parse5';

export interface Matcher { (node: parse5.ASTNode): boolean; }
;

export const urlAttrMatchers: (Matcher)[] =
    constants.URL_ATTR.map(attr => predicates.hasAttr(attr));

export const urlAttrs: Matcher = predicates.OR.apply(null, urlAttrMatchers);

export const jsMatcher: Matcher = predicates.AND(
    predicates.hasTagName('script'),
    predicates.OR(
        predicates.NOT(predicates.hasAttr('type')),
        predicates.hasAttrValue('type', 'text/javascript'),
        predicates.hasAttrValue('type', 'application/javascript')));

export const externalStyle: Matcher = predicates.AND(
    predicates.hasTagName('link'),
    predicates.hasAttrValue('rel', 'stylesheet'));
// polymer specific external stylesheet
export const polymerExternalStyle: Matcher = predicates.AND(
    predicates.hasTagName('link'), predicates.hasAttrValue('rel', 'import'),
    predicates.hasAttrValue('type', 'css'));

export const styleMatcher: Matcher = predicates.AND(
    predicates.hasTagName('style'),
    predicates.OR(
        predicates.NOT(predicates.hasAttr('type')),
        predicates.hasAttrValue('type', 'text/css')));

export const targetMatcher: Matcher = predicates.AND(
    predicates.OR(predicates.hasTagName('a'), predicates.hasTagName('form')),
    predicates.NOT(predicates.hasAttr('target')));

export const head: Matcher = predicates.hasTagName('head');
export const body: Matcher = predicates.hasTagName('body');
export const base: Matcher = predicates.hasTagName('base');
export const domModule: Matcher = predicates.AND(
    predicates.hasTagName('dom-module'), predicates.hasAttr('id'),
    predicates.NOT(predicates.hasAttr('assetpath')));
export const meta: Matcher = predicates.AND(
    predicates.hasTagName('meta'), predicates.hasAttr('charset'));
export const polymerElement: Matcher = predicates.hasTagName('polymer-element');
export const externalJavascript: Matcher =
    predicates.AND(predicates.hasAttr('src'), jsMatcher);
export const inlineJavascript: Matcher =
    predicates.AND(predicates.NOT(predicates.hasAttr('src')), jsMatcher);
export const htmlImport: Matcher = predicates.AND(
    predicates.hasTagName('link'), predicates.hasAttrValue('rel', 'import'),
    predicates.hasAttr('href'));

const hiddenDiv = predicates.AND(
    predicates.hasTagName('div'), predicates.hasAttr('hidden'),
    predicates.hasAttr('by-vulcanize'));

const inHiddenDiv = predicates.parentMatches(hiddenDiv);
