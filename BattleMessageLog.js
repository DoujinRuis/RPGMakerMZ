/*:
 * @target MZ
 * @plugindesc バトル中のセリフをログに記録し、キーボードで呼び出せるようにするプラグイン✨
 * @author サラ
 * 
 * @help
 * 【修正点】
 * ・プラグインコマンドを廃止！
 * ・"L" キーを押すとバトルメッセージログを表示/非表示！
 * ・もう一度押すと元のバトルシーンに戻る！
 */

(() => {
    const pluginName = "BattleMessageLog";
    let isLogOpen = false; // ログウィンドウの開閉状態を管理

    // バトルログを保存するための配列
    let battleMessageLog = [];

    // RPGツクールMZのエスケープ文字を展開する関数
    function convertEscapeCharactersProperly(text) {
        const dummyWindow = new Window_Base(new Rectangle(0, 0, 1, 1));
        return dummyWindow.convertEscapeCharacters(text);
    }

    // メッセージをログに記録するためのフック
    const _Game_Message_add = Game_Message.prototype.add;
    Game_Message.prototype.add = function(text) {
        const convertedText = convertEscapeCharactersProperly(text);
        _Game_Message_add.call(this, text);

        if ($gameParty.inBattle()) {
            battleMessageLog.push(convertedText);
        }
    };

    // バトルログウィンドウのクラス
    class Window_BattleLog extends Window_Base {
        constructor(rect) {
            super(rect);
            this.refresh();
        }

        refresh() {
            this.contents.clear();
            let y = 0;
            battleMessageLog.forEach((message) => {
                this.drawText(message, 10, y, this.contentsWidth(), "left");
                y += this.lineHeight();
            });
        }
    }

    // バトルログを表示するシーン
    class Scene_BattleLog extends Scene_MenuBase {
        create() {
            super.create();
            this.createBattleLogWindow();
        }

        createBattleLogWindow() {
            const rect = new Rectangle(100, 100, Graphics.width - 200, Graphics.height - 200);
            this._battleLogWindow = new Window_BattleLog(rect);
            this.addWindow(this._battleLogWindow);
        }

        update() {
            super.update();
            if (Input.isTriggered('log')) { // Lキーを押したらログを閉じる
                SceneManager.pop();
                isLogOpen = false;
            }
        }
    }

    // キー入力でログを開閉する
    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.call(this);
        
        if (Input.isTriggered('log') && !isLogOpen) { // Lキーでログを開く
            SceneManager.push(Scene_BattleLog);
            isLogOpen = true;
        }
    };

    // Lキーをカスタムキーとして登録
    Input.keyMapper[76] = 'log'; // "L" キー（ASCIIコード76）

})();
