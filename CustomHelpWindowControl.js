// CustomHelpWindowControl.js

/*:
 * @target MZ
 * @plugindesc 制御可能なヘルプウィンドウの表示切替を追加するプラグイン
 *
 * @help
 * このプラグインは、Scene_CustomMenuのヘルプウィンドウを制御します。
 * help_window(0) または help_window(1) を呼び出すことで、
 * ヘルプウィンドウを非表示または表示に切り替えることができます。
 *
 */

(function() {
    const _Scene_CustomMenu_create = Scene_CustomMenu.prototype.create;
    Scene_CustomMenu.prototype.create = function() {
        _Scene_CustomMenu_create.call(this);
        // ヘルプウィンドウの状態を保持するプロパティを追加
        this._isHelpWindowVisible = true;
    };

    // help_window コマンドを追加
    window.help_window = function(state) {
        const scene = SceneManager._scene;
        if (scene instanceof Scene_CustomMenu && scene._helpWindow) {
            scene._helpWindow.visible = state === 1;
            scene._isHelpWindowVisible = scene._helpWindow.visible;
        }
    };

    // シーンのアップデートメソッドを拡張して、ヘルプウィンドウの状態を反映
    const _Scene_CustomMenu_update = Scene_CustomMenu.prototype.update;
    Scene_CustomMenu.prototype.update = function() {
        _Scene_CustomMenu_update.call(this);
        if (this._helpWindow) {
            this._helpWindow.visible = this._isHelpWindowVisible;
        }
    };
})();
