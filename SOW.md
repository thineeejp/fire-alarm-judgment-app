より洗練されたUIにするための具体的な改善案をまとめました。

1.  **ブロックデザイン**: 左側の太線をなくし、よりモダンでクリーンなカードスタイルに変更します。
2.  **号数タグ**: 「1号」「3号」などを、視認性の高いタグ形式で表示します。
3.  **レイアウト修正**: 「建物全体」タグを「設置範囲」タイトルの下に正しく配置し、アイコンの文字化けを修正します。
4.  **箇条書き修正**: 二重になっていた箇条書きのマーカーを修正します。

### 完成イメージ（改善後）

こちらが修正後のデザインイメージです。ご指摘の点がすべて解消されています。

<div class="result-card warning" style="background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%); color: #ff8f00; border: 1px solid #ffe082; border-radius: 12px; padding: 16px; font-family: sans-serif;">
    <div style="display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 500; margin-bottom: 8px;">
        <span>⚠️</span>
        <span>自動火災報知設備の設置義務</span>
    </div>
    <div style="font-size: 14px; margin-bottom: 16px;">設置義務あり</div>
    <div class="result-details" style="display: flex; flex-direction: column; gap: 12px;">
        <!-- 法的根拠ブロック -->
        <div class="result-block" style="background-color: rgba(255,255,255,0.6); padding: 12px; border-radius: 8px;">
            <h4 style="margin: 0 0 8px; font-size: 14px; color: #616161; font-weight: 500; display: flex; align-items: center; gap: 8px;"><span class="material-icons" style="font-size: 18px;">gavel</span>法的根拠</h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.5;">この建物は消防法施行令第21条により自動火災報知設備の設置義務があります。</p>
            <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px;">
                <span style="background-color: #d6e3ee; color: #34485e; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">1号</span>
                <span style="background-color: #d6e3ee; color: #34485e; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">3号</span>
            </div>
        </div>
        <!-- 設置範囲ブロック -->
        <div class="result-block" style="background-color: rgba(255,255,255,0.6); padding: 12px; border-radius: 8px;">
            <h4 style="margin: 0 0 8px; font-size: 14px; color: #616161; font-weight: 500; display: flex; align-items: center; gap: 8px;"><span class="material-icons" style="font-size: 18px;">layers</span>設置範囲</h4>
            <div style="display: inline-flex; align-items: center; gap: 4px; background-color: #ffe082; color: #ff6f00; padding: 4px 10px; border-radius: 16px; font-size: 14px; font-weight: 500; border: 1px solid #ffd54f;">
                <span>🏢</span>
                <span>建物全体</span>
            </div>
            <ul style="margin: 8px 0 0; padding-left: 20px; font-size: 14px; line-height: 1.5;">
                <li>建物全体に設置義務があります（3号）。</li>
                <li>(5)項イ 部分にも設置義務があります（1号）。</li>
            </ul>
        </div>
    </div>
</div>

---

### 実装手順

以下の3ファイルを修正します。

#### 1. `hantei.js` の修正

まず、データ生成側を修正します。UIに依存した箇条書きの「・」を削除し、号数をタグ表示しやすいようにデータを分離します。

**ファイル:** `hantei.js`
**関数:** `generateResultDescription`

```javascript
/**
 * 判定結果を構造化されたオブジェクトとして生成する関数
 * @param {object} 判定結果_令21 - 令第21条の判定結果
 * @param {object} 特小判定結果 - 特小自火報の判定結果
 * @param {object} 建物情報 - 建物情報
 * @returns {object} 構造化された判定結果説明オブジェクト
 */
function generateResultDescription(判定結果_令21, 特小判定結果, 建物情報) {
    const structuredResult = {
        rei21: null,
        tokusho: null
    };

    // --- STEP 1: 令第21条の判定結果を構造化 ---
    if (判定結果_令21.根拠リスト.length > 0) {
        // ... (scopeDetails の生成ロジックは変更なし)

        structuredResult.rei21 = {
            hasObligation: true,
            legalBasis: {
                title: "法的根拠",
                description: `この建物は消防法施行令第21条により自動火災報知設備の設置義務があります。`,
                // ▼▼▼ 変更点: 号数を配列として分離 ▼▼▼
                applicableLaws: 判定結果_令21.根拠リスト 
            },
            // ... (scope, specialNote は変更なし)
        };
    } else {
        // ... (変更なし)
    }

    // ... (特小判定結果の構造化は変更なし)

    return structuredResult;
}
```
*(注: `generateResultDescription`関数内の他の部分は変更がないため省略しました。`legalBasis`オブジェクトの構造のみ上記のように修正してください。)*

#### 2. `ui.js` の修正

次に、UI構築ロジックを修正し、新しいデザインとデータ構造に対応させます。

**ファイル:** `ui.js`
**関数:** `displayResult`, `createResultBlock`

```javascript
/**
 * 判定結果を表示
 */
function displayResult(判定結果_令21, 特小判定結果, 建物情報) {
    // ... (前半部分は変更なし) ...

    if (rei21Result.hasObligation) {
        // ▼▼▼ 法的根拠ブロックの生成ロジックを修正 ▼▼▼
        const legalBasisBlock = createResultBlock(
            rei21Result.legalBasis.title, 
            rei21Result.legalBasis.description,
            'gavel' // アイコン名を渡す
        );

        // 号数タグのコンテナを作成
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'legal-tags-container';
        rei21Result.legalBasis.applicableLaws.forEach(law => {
            const tag = document.createElement('span');
            tag.className = 'legal-number-tag';
            tag.textContent = law;
            tagsContainer.appendChild(tag);
        });
        legalBasisBlock.appendChild(tagsContainer);
        rei21DetailsContainer.appendChild(legalBasisBlock);
        // ▲▲▲ 法的根拠ブロックの修正ここまで ▲▲▲


        // ▼▼▼ 設置範囲ブロックの生成ロジックを修正 ▼▼▼
        const scopeBlock = createResultBlock(
            rei21Result.scope.title, 
            null, // 説明文は不要
            'layers' // アイコン名を渡す
        );
        
        // サマリータグ (変更なし)
        const summaryTag = document.createElement('div');
        summaryTag.className = 'result-summary-tag';
        summaryTag.classList.add(rei21Result.scope.type === 'whole' ? 'result-summary-tag--whole' : 'result-summary-tag--partial');
        summaryTag.innerHTML = `
            <span class="material-icons">${rei21Result.scope.type === 'whole' ? 'business' : 'splitscreen'}</span>
            ${rei21Result.scope.type === 'whole' ? '建物全体' : '一部分のみ'}
        `;
        // タイトルの後にタグを追加
        scopeBlock.querySelector('.result-block-title').insertAdjacentElement('afterend', summaryTag);

        // 設置範囲の詳細リスト (変更なし)
        if (rei21Result.scope.details.length > 0) {
            const list = document.createElement('ul');
            list.className = 'result-block-list';
            rei21Result.scope.details.forEach(text => {
                const li = document.createElement('li');
                li.textContent = text;
                list.appendChild(li);
            });
            scopeBlock.appendChild(list);
        }
        rei21DetailsContainer.appendChild(scopeBlock);
        // ▲▲▲ 設置範囲ブロックの修正ここまで ▲▲▲

        // 補足事項ブロック (変更なし)
        // ...
    } 
    // ... (以降は変更なし) ...
}


/**
 * 結果表示用の汎用ブロックを生成
 */
function createResultBlock(title, description, iconName = null) {
    const block = document.createElement('div');
    block.className = 'result-block';
    
    // ▼▼▼ アイコン表示に対応 ▼▼▼
    const iconHtml = iconName ? `<span class="material-icons">${iconName}</span>` : '';
    block.innerHTML = `<h4 class="result-block-title">${iconHtml}${title}</h4>`;

    if (description) {
        const content = document.createElement('p');
        content.className = 'result-block-content';
        content.innerHTML = description.replace(/\n/g, '<br>');
        block.appendChild(content);
    }
    
    return block;
}
```

#### 3. `styles.css` の修正

最後に、新しいデザインを適用するためのスタイルを`styles.css`に追加・修正します。

**ファイル:** `styles.css`

```css
/* ========================
   構造化された結果表示 (修正)
   ======================== */
.result-details {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md); /* ブロック間の余白を調整 */
    white-space: normal;
}

/* ▼▼▼ デザイン変更 ▼▼▼ */
.result-block {
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.result-block-title {
    font-size: var(--md-sys-typescale-label-large-size);
    font-weight: 500;
    color: var(--neutral-700);
    margin: 0 0 var(--spacing-sm) 0;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}
.result-block-title .material-icons {
    font-size: 20px;
}

.result-block-content {
    margin: 0;
    line-height: 1.6;
    color: var(--neutral-800);
}

/* ▼▼▼ 設置範囲タグの余白を調整 ▼▼▼ */
.result-summary-tag {
    margin-top: 0;
    margin-bottom: var(--spacing-sm);
}

.result-block-list {
    margin: var(--spacing-sm) 0 0 0;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

/* ... (他のスタイルは変更なし) ... */

/* ▼▼▼ 新規追加: 号数タグ ▼▼▼ */
.legal-tags-container {
    margin-top: var(--spacing-sm);
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
}

.legal-number-tag {
    background-color: var(--primary-100);
    color: var(--primary-800);
    padding: 2px 10px;
    border-radius: var(--radius-full);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.5;
}
```

### 修正のポイント

-   **データと表示の分離**: `hantei.js`は純粋なデータ（号数の配列）を返し、`ui.js`がそれを元にタグを生成するように責務を明確化しました。
-   **クリーンなデザイン**: `.result-block`のスタイルから太い枠線を削除し、背景色と細い境界線で上品に情報をグループ化しました。
-   **コンポーネント指向**: `createResultBlock`関数を拡張し、アイコンを引数で渡せるようにしたことで、再利用性が向上しました。
-   **レイアウトの正確性**: `insertAdjacentElement`を使って、サマリータグをタイトルの直後に正確に配置するように修正しました。