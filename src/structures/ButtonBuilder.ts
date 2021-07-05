const buttonStyles = [
  { color: 'BLURPLE', number: 1 },
  { color: 'GREY', number: 2 },
  { color: 'GREEN', number: 3 },
  { color: 'RED', number: 4 },
  { color: 'URL', number: 5 },
];

type buttonStyle = 'BLURPLE' | 'GREY' | 'GREEN' | 'RED' | 'URL';

interface EmojiOptions {
  name?: string;
  id?: string;
  animated?: boolean;
}

/**
 * Class symbolizing a `ButtonBuilder`
 * @class
 */
export class ButtonBuilder {
  /**
   * The button type
   * @default 2
   */
  public type: number;

  /**
   * If the button is disabled or not
   * @default false
   */
  public disable?: boolean;

  /**
   * The button style
   * @default 1
   */
  public style?: buttonStyle | number;

  /**
   * The button label
   */
  public label: string | any;

  /**
   * The button emoji
   */
  public emoji?: EmojiOptions;

  /**
   * The button custom ID
   */
  public customID?: string;

  /**
   * The button URL
   */
  public URL?: string;

  /**
   * @constructor
   * Create a new ButtonBuilder
   */
  constructor() {
    this.type = 2;
    this.disable = false;
    this.style = 1;
    this.label = undefined;
    this.emoji = undefined;
    this.customID = undefined;
    this.URL = undefined;
  }

  /**
   * Set the button label
   * @param {string} label
   * @returns {ButtonBuilder}
   * @example
   * new ButtonBuilder().setLabel('Some label');
   */
  setLabel(label: string): ButtonBuilder {
    if (!label || label.length > 80) throw new SyntaxError('INVALID_LABEL');
    this.label = label;
    return this;
  }

  /**
   * Set the button style.
   * Available styles:
   * * BLURPLE (1)
   * * GREY (2)
   * * GREEN (3)
   * * RED (4)
   * * URL (5)
   * @param {buttonStyle|number} style
   * @returns {ButtonBuilder}
   * @default 1
   * @example
   * new ButtonBuilder().setStyle('GREEN');
   * // Or using number
   * new ButtonBuilder().setStyle(3);
   */
  setStyle(style: buttonStyle | number): ButtonBuilder {
    if (!style) this.style = 1;
    else {
      const btnStyle = buttonStyles.find((elm) => elm.color === style || elm.number === style);
      if (!btnStyle) throw new SyntaxError('INVALID_STYLE');
      this.style = btnStyle.number;
    }
    return this;
  }

  /**
   * Set the button emoji
   * @param {string} emoji
   * @returns {ButtonBuilder}
   * @example
   * new ButtonBuilder().setEmoji('👌');
   */
  setEmoji(emoji: string): ButtonBuilder {
    if (!emoji || !this._isEmoji(emoji)) throw new SyntaxError('INVALID_EMOJI');
    this.emoji = {};
    this.emoji.name = emoji;
    return this;
  }

  /**
   * Set the button id
   * @param id
   * @returns {ButtonBuilder}
   * @example
   * new ButtonBuilder().setID('some_id_using_underscores');
   */
  setID(id: string): ButtonBuilder {
    if (!id || id.length > 100) throw new SyntaxError('INVALID_ID');
    this.customID = id;
    return this;
  }

  /**
   * Set the button URL. *The button style must be `URL (5)`*
   * @param {string} url
   * @returns {ButtonBuilder}
   * @example
   * new ButtonBuilder().setURL('valid URL');
   */
  setURL(url: string): ButtonBuilder {
    if (this.style !== 5) throw new SyntaxError('BAD_BUTTON_STYLE');
    if (!url || !this._testURL(url)) throw new SyntaxError('INVALID_URL');
    this.URL = url;
    return this;
  }

  /**
   * Set the disable parameter. *The button style musn't be `URL (5)`*
   * @param {boolean} state
   * @returns {ButtonBuilder}
   * @example new ButtonBuilder().setDisable(false);
   */
  setDisable(state?: boolean): ButtonBuilder {
    if (this.style === 5) throw new SyntaxError('BAD_BUTTON_STYLE');
    if (!state) {
      this.disable = true;
    } else {
      this.disable = state;
    }
    return this;
  }

  /**
   * Get the json content of the button
   * @returns {Object}
   * @example new ButtonBuilder().getJson()
   */
  getJSON(): object {
    if (!this.customID) throw new SyntaxError('ERREUR ICI');
    return {
      type: this.type,
      label: this.label,
      style: this.style,
      custom_id: this.customID,
      emoji: this.emoji,
      disable: this.disable,
      url: this.URL,
    };
  }

  private _isEmoji(emoji: string): boolean {
    if (
      emoji.match(
        [
          '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])', // U+1F680 to U+1F6FF
        ].join('|'),
      )
    ) {
      return true;
    }
    return false;
  }

  private _testURL(url: string): boolean {
    const urlRegex = new RegExp(
      '^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$',
      'i',
    );
    return !!urlRegex.test(url);
  }
}
