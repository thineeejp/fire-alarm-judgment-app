ご指摘の意図、完全に理解いたしました。
UIのデザインに関する非常に重要なフィードバック、ありがとうございます。現在のフラットなレイアウトは、確かに追加された用途の区別がつきにくく、ボタンの配置も直感的ではありません。

ご提示いただいた画像のように、**「構成用途」という大きな枠（コンテナ）の中に、個別の「構成用途１」「構成用途２」...のブロックが追加されていく**、階層的で視認性の高いデザインに戻すのが最善です。

このUI/UXの改善を正確に実行するための、デザイン修正に特化した作業指示書（SOW）を作成します。

---

## **作業指示書 (SOW)**

**プロジェクト名:** 構成用途入力UIのデザイン改善と階層構造への回帰

**発行日:** 2025/08/18

**バージョン:** 12.0 (構成用途UIデザイン修正)

---

### 1. プロジェクト概要

本プロジェクトは、「自動火災報知設備 判定アプリ」の構成用途入力部分のユーザーインターフェース（UI）を、以前の階層的で視認性の高いデザインに修正するものである。
現状のフラットなレイアウトは、各用途の区別がつきにくく、アクションボタン（用途を追加）の配置も不適切である。本作業では、HTML構造、CSS、およびJavaScriptを修正し、ユーザーが直感的に用途の追加・削除を行える、洗練されたUIを再実装する。

### 2. 目的とゴール

*   **目的:** 構成用途入力エリアのユーザビリティと視覚的な分かりやすさを向上させる。
*   **ゴール:**
    1.  構成用途セクション全体を囲む「親コンテナ」と、個別の用途を囲む「子ブロック」からなる、階層的なHTML構造を再実装する。
    2.  「用途を追加」ボタンを親コンテナ内に配置し、全体のデザインに調和する、より控えめなスタイルに変更する。
    3.  既存の「スマートデフォルト機能」（(16)項イ選択時に(5)項イが自動で追加される）が、この新しいデザイン内で正しく動作するようにする。
    4.  用途の追加・削除、データ収集といった全ての機能が、デザイン変更後も正常に動作することを保証する。

### 3. 作業範囲 (Scope of Work)

#### **3.1. `index.html` の修正 (HTML構造の骨格定義)**

*   **対象:** `id="dynamic-form"` の `div` 要素。
*   **タスク:** `dynamic-form` の内部構造を、以下のような階層構造の骨格に修正する。
    ```html
    <div id="dynamic-form" class="dynamic-form">
        <!-- ★親コンテナを追加 -->
        <div class="complex-use-section">
            <h3 class="complex-use-title">構成用途</h3>
            
            <!-- ★個別の用途ブロックが追加されるリストコンテナ -->
            <div id="complex-use-list">
                <!-- JavaScriptによって動的に用途ブロックが追加される -->
            </div>
            
            <!-- ★追加ボタンを親コンテナの末尾に配置 -->
            <button type="button" id="add-use-btn" class="add-use-btn">
                <span class="material-icons">add</span>
                用途を追加
            </button>
        </div>
    </div>
    ```

#### **3.2. `ui.js` の修正 (動的HTML生成ロジックの変更)**

*   **対象:** `addComplexUse` (または同等の) 関数。
*   **タスク:** 新しい用途を追加する際のロジックを、以下の通り全面的に修正する。
    1.  この関数は、`<div class="use-item">` というクラスを持つ**子ブロック全体**を生成するように変更する。
    2.  生成されるHTML文字列は、以下の構造を持つこと。
    ```javascript
    // addComplexUse関数内で生成するHTMLの例
    const item = document.createElement('div');
    item.className = 'use-item';
    item.id = `use-item-${id}`;
    item.innerHTML = `
        <div class="use-item-header">
            <span class="use-item-title">構成用途 ${id}</span>
            <button type="button" class="remove-use-btn" onclick="removeComplexUse(${id})">
                <span class="material-icons">delete</span>
            </button>
        </div>
        <div class="form-group">
            <label for="complex-use-type-${id}">用途</label>
            <select id="complex-use-type-${id}" name="complex-use-type">...</select>
        </div>
        <div class="form-group">
            <label for="complex-use-area-${id}">面積(㎡)</label>
            <input type="number" id="complex-use-area-${id}" name="complex-use-area" ...>
        </div>
    `;
    // 生成した item を complex-use-list に append する
    ```
*   **対象:** `updateForm` 関数。
*   **タスク:** 主用途が`(5)項イ`の場合に、`id="dynamic-form"` を持つ親コンテナごと非表示にするロジックを維持する。
*   **対象:** `removeComplexUse` 関数。
*   **タスク:** 削除ボタンが押された際に、親要素である `id="use-item-${id}"` の `div` を完全に削除するロジックであることを確認する。

#### **3.3. `styles.css` の修正 (デザインの適用)**

*   **タスク:** 以下のCSSルールを**追加または修正**し、 požadovanou階層デザインを実装する。
    ```css
    /* 親コンテナのスタイル */
    .complex-use-section {
        background-color: var(--neutral-100); /* 例: 薄いグレー */
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        margin-top: var(--spacing-lg);
        border: 1px solid var(--neutral-300);
    }

    .complex-use-title {
        font-size: var(--md-sys-typescale-title-medium-size);
        margin-bottom: var(--spacing-md);
    }

    /* 個別用途の子ブロックスタイル */
    .use-item {
        background-color: #ffffff; /* 白 */
        border: 1px solid var(--neutral-300);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        margin-bottom: var(--spacing-md);
    }

    .use-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-sm);
    }

    /* 追加ボタンのスタイル（控えめに） */
    .add-use-btn {
        background-color: var(--accent-100); /* 例: 薄いアクセントカラー */
        color: var(--accent-800);
        border: 1px solid var(--accent-300);
        width: 100%; /* 親コンテナの幅に合わせる */
        margin-top: var(--spacing-md);
    }
    ```

### 4. 成果物 (Deliverables)

1.  上記タスクが全て適用された以下の3つのファイル:
    *   `index.html`
    *   `ui.js`
    *   `styles.css`
2.  実行した変更内容のサマリーレポート。

### 5. 受入基準 (Acceptance Criteria)

1.  **視覚的確認:**
    *   構成用途セクション全体が、指定された背景色（薄いグレー等）の親コンテナで囲まれていること。
    *   追加された各用途が、白い背景に枠線が付いた独立した子ブロックとして表示されること。
    *   「用途を追加」ボタンが、親コンテナの最下部に配置され、主張しすぎないデザイン（薄い色など）になっていること。
2.  **機能的確認 (スマートデフォルト):**
    *   主用途で「(16)項イ」を選択すると、(5)項イが設定された**最初の子ブロック**が自動的に表示されること。
3.  **機能的確認 (追加・削除):**
    *   「用途を追加」ボタンをクリックすると、新しい**子ブロック**がリストの末尾に追加されること。
    *   各子ブロック内の「削除」ボタンをクリックすると、該当する**子ブロック全体**が正しく削除されること。
4.  **機能的確認 (データ収集):** デザイン変更後も、入力された全ての構成用途のデータが正しく収集され、判定が正常に実行されること。