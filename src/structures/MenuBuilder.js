"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuBuilder = void 0;
/**
 * Class symbolizing a `MenuBuilder`
 * @class
 */
class MenuBuilder {
    constructor() {
        this.options = [];
    }
    /**
     * Add a menu label
     * @param {string} label
     * @param {LabelOptions} options
     * @returns {MenuBuilder}
     * @example new MenuBuilder().addLabel('Label', { description: 'Some description', value: 'label' })
     */
    addLabel(Label, options) {
        if (!Label || typeof Label !== 'string')
            throw new SyntaxError('INVALID_LABEL');
        if (!options || typeof options !== 'object')
            throw new SyntaxError('INVALID_LABEL_OPTIONS');
        this.options.push({
            label: Label,
            value: options.value,
            description: options.description,
            emoji: options.emoji !== undefined ? { name: options.emoji.name, id: options.emoji.id } : undefined,
        });
        return this;
    }
    /**
     * Set the menu custom ID
     * @param {string} id
     * @returns {MenuBuilder}
     * @example new MenuBuilder().setCustomID('some-id-without-spaces')
     */
    setCustomID(id) {
        if (!id || typeof id !== 'string' || id.indexOf(' ') >= 0)
            throw new SyntaxError('INVALID_CUSTOM_ID');
        this.customID = id;
        return this;
    }
    /**
     * Set the menu place holder
     * @param {string} placeHolder
     * @returns {MenuBuilder}
     * @example new MenuBuilder().setPlaceHolder('cool-placeholder-without-spaces')
     */
    setPlaceHolder(placeHolder) {
        if (!placeHolder || typeof placeHolder !== 'string')
            throw new SyntaxError('INVALID_PLACE_HOLDER');
        this.placeHolder = placeHolder;
        return this;
    }
    /**
     * Set the menu min values
     * @param {number} value
     * @returns {MenuBuilder}
     * @example new MenuBuilder().setMinValues(1);
     */
    setMinValues(value) {
        if (typeof value !== 'number') // made modification here
            throw new SyntaxError('INVALID_MIN_VALUE');
        this.minValues = value;
        return this;
    }
    /**
     * Set the menu max values
     * @param {number} value Up to **`25`**
     * @returns {MenuBuilder}
     * @example new MenuBuilder().setMaxValues(3);
     */
    setMaxValues(value) {
        if (!value || typeof value !== 'number')
            throw new SyntaxError('INVALID_MAX_VALUE');
        this.maxValues = value;
        return this;
    }
    /**
     * Return the menu JSON object
     * @returns {object}
     */
    getJSON() {
        if (this.customID &&
            typeof this.customID === 'string' &&
            this.options !== undefined &&
            typeof this.options === 'object') {
            return {
                type: 3,
                custom_id: this.customID,
                options: this.options,
                placeholder: this.placeHolder,
                min_values: this.minValues === undefined ? 1 : this.minValues,
                max_values: this.maxValues === undefined ? Object.keys(this.options).length : this.maxValues,
            };
        }
        throw new Error('INVALID_MENU');
    }
}
exports.MenuBuilder = MenuBuilder;
