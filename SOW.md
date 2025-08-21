## 問題の分析

ご提示いただいた状況を分析しますと、判定結果のテキストが改行されずに一行で表示されてしまい、非常に読みにくくなっています。これは、JavaScriptで生成された改行コード（`\n`）がHTML上で適切に解釈されていないことが原因です。

コード全体を確認したところ、`hantei.js`の`generateResultDescription`関数では改行コード（`\n`）を含む文字列を正しく生成していますが、`ui.js`でその文字列を画面に表示する際に`element.textContent`を使用しているため、改行が無視されていました。

## 解決策

この問題を解決する最もシンプルで効果的な方法は、**CSSを一行追加**することです。JavaScriptのロジックを変更することなく、表示スタイルのみを修正するため、影響範囲が最小限で済み、保守性も高まります。

具体的には、結果詳細を表示する要素（`.result-details`）に対して、CSSの`white-space`プロパティを設定します。これにより、テキスト内の改行コードや連続するスペースをHTML上でそのまま表示させることができます。

## 具体的な修正内容

`styles.css`ファイル内の`.result-details`セレクタに`white-space: pre-wrap;`を追加してください。

**ファイル:** `styles.css`

```css
/* 修正前 */
.result-details {
    font-size: var(--md-sys-typescale-body-medium-size);
    line-height: var(--md-sys-typescale-body-medium-line-height);
    margin-bottom: var(--spacing-md);
}

/* 修正後 */
.result-details {
    font-size: var(--md-sys-typescale-body-medium-size);
    line-height: var(--md-sys-typescale-body-medium-line-height);
    margin-bottom: var(--spacing-md);
    white-space: pre-wrap; /* ← この行を追加 */
    word-wrap: break-word; /* ← 長いURLなどでのレイアウト崩れ防止に追加 */
}
```

### 修正による効果

このCSSを1行追加するだけで、アプリケーションは以下のように改善されます。

1.  **可読性の向上**: `generateResultDescription`関数で意図した通りに改行が表示され、判定根拠や補足事項が明確に区切られます。
2.  **保守性の維持**: 表示ロジックとスタイルを適切に分離できます。将来、`hantei.js`の文言を変更する際も、改行を意識するだけで済み、HTMLタグ（`<br>`）を混在させる必要がありません。
3.  **一貫性の確保**: この修正は`.result-details`クラスが適用されているすべての要素（「設置義務」「特小判定」「入力内容の確認」カード）に適用されるため、表示に一貫性が生まれます。

**修正後の表示イメージ:**

<div class="result-card warning" style="background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%); color: #ff8f00; border: 1px solid #ffe082; border-radius: 12px; padding: 16px; font-family: sans-serif;">
    <div style="display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 500; margin-bottom: 8px;">
        <span>⚠️</span>
        <span>自動火災報知設備の設置義務</span>
    </div>
    <div style="font-size: 14px; margin-bottom: 16px;">設置義務あり</div>
    <div style="font-size: 14px; line-height: 1.5; white-space: pre-wrap;">この建物は消防法施行令第21条により自動火災報知設備の設置義務があります。
該当する号: 1号, 3号

建物全体に設置義務があります（3号）。
以下の部分に設置義務があります：
- (5)項イ 部分（1号）

【補足事項】
この建物は小規模特定用途複合防火対象物に該当するため、省令第23条第４項第１号ヘの規定により、みなし従属不可用途以外の部分には設置を要しません。</div>
</div>
<br>
<div class="result-card success" style="background: linear-gradient(135deg, #f0faf7 0%, #d6f2ea 100%); color: #254637; border: 1px solid #b8e7d8; border-radius: 12px; padding: 16px; font-family: sans-serif;">
    <div style="display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 500; margin-bottom: 8px;">
        <span>✔️</span>
        <span>特定小規模施設用自動火災報知設備</span>
    </div>
    <div style="font-size: 14px; margin-bottom: 16px;">設置可能</div>
    <div style="font-size: 14px; line-height: 1.5; white-space: pre-wrap;">特定小規模施設に関する省令 第2条第1号【ロ号】に該当します。</div>
</div>