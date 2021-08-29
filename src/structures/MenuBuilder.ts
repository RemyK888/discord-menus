interface LabelOptions {
  /**
   * The label value
   */
  value: string;
  /**
   * The label description
   */
  description: string;
  /**
   * the label emoji
   */
  emoji?: EmojiOptions;
}

interface EmojiOptions {
  /**
   * The label emoji name
   */
  name: string;
  /**
   * The label emoji ID (id needed)
   */
  id?: string;
}

/**
 * Class symbolizing a `MenuBuilder`
 * @class
 */
export class MenuBuilder {
  /**
   * The menu custom ID
   */
  public customID!: string;

  /**
   * The menu options
   */
  public options!: any[];

  /**
   * The menu place holder
   */
  public placeHolder!: string;

  /**
   * The menu max values
   */
  public maxValues!: number;

  /**
   * The menu min values
   */
  public minValues!: number;

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
  public addLabel(Label: string, options: LabelOptions): MenuBuilder {
    if (!Label || typeof Label !== 'string') throw new SyntaxError('INVALID_LABEL');
    if (!options || typeof options !== 'object') throw new SyntaxError('INVALID_LABEL_OPTIONS');
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
  public setCustomID(id: string): MenuBuilder {
    if (!id || typeof id !== 'string' || id.indexOf(' ') >= 0) throw new SyntaxError('INVALID_CUSTOM_ID');
    this.customID = id;
    return this;
  }

  /**
   * Set the menu place holder
   * @param {string} placeHolder
   * @returns {MenuBuilder}
   * @example new MenuBuilder().setPlaceHolder('cool-placeholder-without-spaces')
   */
  public setPlaceHolder(placeHolder: string): MenuBuilder {
    if (!placeHolder || typeof placeHolder !== 'string') throw new SyntaxError('INVALID_PLACE_HOLDER');
    this.placeHolder = placeHolder;
    return this;
  }

  /**
   * Set the menu min values
   * @param {number} value
   * @returns {MenuBuilder}
   * @example new MenuBuilder().setMinValues(1);
   */
  public setMinValues(value: number): MenuBuilder {
    if (typeof value !== 'number') throw new SyntaxError('INVALID_MIN_VALUE');
    this.minValues = value;
    return this;
  }

  /**
   * Set the menu max values
   * @param {number} value Up to **`25`**
   * @returns {MenuBuilder}
   * @example new MenuBuilder().setMaxValues(3);
   */
  public setMaxValues(value: number): MenuBuilder {
    if (!value || typeof value !== 'number') throw new SyntaxError('INVALID_MAX_VALUE');
    this.maxValues = value;
    return this;
  }

  /**
   * Return the menu JSON object
   * @returns {object}
   */
  public getJSON(): object {
    if (
      this.customID &&
      typeof this.customID === 'string' &&
      this.options !== undefined &&
      typeof this.options === 'object'
    ) {
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
