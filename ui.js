/**
 * ===================================================
 * ui.js - UI制御モジュール
 * ===================================================
 */

// グローバル変数
let currentBuildingInfo = null;
let complexUseCounter = 0;

/**
 * 画面初期化とイベントリスナー設定
 */
function init() {
    // フォーム要素の取得
    const form = document.getElementById('building-form');
    const primaryUseSelect = document.getElementById('primary-use');
    const resetBtn = document.getElementById('reset-btn');
    const submitBtn = document.getElementById('submit-btn');
    const helpModal = document.getElementById('help-modal');
    const closeHelpBtn = document.getElementById('close-help');
    
    // イベントリスナーの設定
    primaryUseSelect.addEventListener('change', updateForm);
    resetBtn.addEventListener('click', resetForm);
    form.addEventListener('submit', handleFormSubmit);
    closeHelpBtn.addEventListener('click', hideHelpModal);
    
    // ヘルプアイコンのイベントリスナー
    document.addEventListener('click', handleHelpClick);
    
    
    // 用途追加ボタンのイベントリスナー（イベント委譲を使用）
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'add-complex-use') {
            addComplexUse();
        }
    });
    
    // 特殊条件の表示/非表示制御
    document.getElementById('toggle-special-conditions')?.addEventListener('click', function() {
        const conditionsList = document.getElementById('special-conditions-list');
        const toggleButton = document.getElementById('toggle-special-conditions');
        
        if (conditionsList && toggleButton) {
            conditionsList.classList.toggle('hidden');
            
            // ボタンのテキストも変更
            if (conditionsList.classList.contains('hidden')) {
                toggleButton.textContent = '特殊要件を確認する';
            } else {
                toggleButton.textContent = '特殊要件を閉じる';
            }
        }
    });
    
    // 初期化
    updateForm();
    console.log('UI初期化完了');
}

/**
 * 主用途の変更に応じて動的フォームを更新
 */
function updateForm() {
    const primaryUse = document.getElementById('primary-use').value;
    const complexUseSection = document.getElementById('complex-use-section');
    const complexUseList = document.getElementById('complex-use-list');
    
    // 用途リストをクリア
    if (complexUseList) {
        complexUseList.innerHTML = '';
    }
    complexUseCounter = 0;
    
    if (primaryUse === '(16)項イ') {
        // 構成用途セクションを表示
        if (complexUseSection) complexUseSection.classList.remove('hidden');
        // スマートデフォルト: 自動的に(5)項イを1項目めとして追加
        addComplexUse(true);
    } else {
        // 構成用途セクションを非表示
        if (complexUseSection) complexUseSection.classList.add('hidden');
    }
}

/**
 * 複合用途項目を追加（SOW 12.0準拠：子ブロック生成）
 * @param {boolean} isPreset - プリセット値設定フラグ（スマートデフォルト用）
 */
function addComplexUse(isPreset = false) {
    const container = document.getElementById('complex-use-list');
    if (!container) return;

    complexUseCounter++;
    const id = complexUseCounter;
    
    // SOW 12.0: 子ブロック全体を生成（構成用途１の固定化対応）
    const item = document.createElement('div');
    item.className = isPreset && complexUseCounter === 1 ? 'use-item use-item-fixed' : 'use-item';
    item.id = `use-item-${id}`;
    
    if (isPreset && complexUseCounter === 1) {
        // 構成用途１：固定テンプレート（削除不可、用途変更不可）
        item.innerHTML = `
            <div class="use-item-header">
                <span class="use-item-title">構成用途 ${id}</span>
            </div>
            <div class="form-group">
                <label class="form-label">用途</label>
                <div class="fixed-use-display">(5)項イ 旅館、ホテル、宿泊所その他これらに類するもの</div>
                <input type="hidden" name="complex-use-type" value="(5)項イ">
            </div>
            <div class="form-group">
                <label for="complex-use-area-${id}" class="form-label">面積（㎡）</label>
                <input type="number" id="complex-use-area-${id}" name="complex-use-area" class="form-input" min="0" step="0.01" required>
            </div>
        `;
    } else {
        // 構成用途２以降：通常テンプレート（削除可、用途変更可）
        item.innerHTML = `
            <div class="use-item-header">
                <span class="use-item-title">構成用途 ${id}</span>
                <button type="button" class="remove-use-btn" onclick="removeComplexUse(${id})">
                    <span class="material-icons">delete</span>
                </button>
            </div>
            <div class="form-group">
                <label for="complex-use-type-${id}" class="form-label">用途</label>
                <select id="complex-use-type-${id}" name="complex-use-type" class="form-select" required>
                    <option value="">選択してください</option>
                    <option value="(1)項イ">(1)項イ 劇場、映画館、演芸場、観覧場</option>
                    <option value="(1)項ロ">(1)項ロ 公会堂、集会場</option>
                    <option value="(2)項イ">(2)項イ キャバレー、カフェー、ナイトクラブ</option>
                    <option value="(2)項ロ">(2)項ロ 遊技場、ダンスホール</option>
                    <option value="(2)項ハ">(2)項ハ 性風俗特殊営業店舗</option>
                    <option value="(3)項イ">(3)項イ 待合、料理店</option>
                    <option value="(3)項ロ">(3)項ロ 飲食店</option>
                    <option value="(4)項">(4)項 百貨店、マーケット、物品販売業店舗</option>
                    <option value="(5)項イ">(5)項イ 旅館、ホテル、宿泊所その他これらに類するもの</option>
                    <option value="(5)項ロ">(5)項ロ 寄宿舎、下宿、共同住宅</option>
                    <option value="(6)項イ(1)">(6)項イ(1) 病院、診療所、助産所</option>
                    <option value="(6)項イ(2)">(6)項イ(2) 老人デイサービスセンター等</option>
                    <option value="(6)項イ(3)">(6)項イ(3) 老人短期入所施設等</option>
                    <option value="(6)項イ(4)">(6)項イ(4) 老人福祉センター等</option>
                    <option value="(6)項ロ">(6)項ロ 幼稚園、小学校等</option>
                    <option value="(6)項ハ（宿泊あり）">(6)項ハ 図書館、博物館等（宿泊あり）</option>
                    <option value="(6)項ハ（宿泊なし）">(6)項ハ 図書館、博物館等（宿泊なし）</option>
                    <option value="(6)項ニ">(6)項ニ 蒸気浴場、熱気浴場</option>
                    <option value="(7)項">(7)項 公衆浴場</option>
                    <option value="(8)項">(8)項 工場、作業場</option>
                    <option value="(9)項イ">(9)項イ 車両の停車場、船舶・航空機の発着場</option>
                    <option value="(9)項ロ">(9)項ロ 神社、寺院、教会</option>
                    <option value="(10)項">(10)項 事務所</option>
                    <option value="(11)項">(11)項 放送スタジオ、電話交換所</option>
                    <option value="(12)項イ">(12)項イ 自動車車庫、駐車場</option>
                    <option value="(12)項ロ">(12)項ロ 飛行機又は回転翼航空機の格納庫</option>
                    <option value="(13)項イ">(13)項イ 倉庫</option>
                    <option value="(13)項ロ">(13)項ロ 危険物の貯蔵場</option>
                    <option value="(14)項">(14)項 前各項に該当しない事業場</option>
                    <option value="(15)項">(15)項 建築物の地階</option>
                    <option value="一般住宅">一般住宅</option>
                </select>
            </div>
            <div class="form-group">
                <label for="complex-use-area-${id}" class="form-label">面積（㎡）</label>
                <input type="number" id="complex-use-area-${id}" name="complex-use-area" class="form-input" min="0" step="0.01" required>
            </div>
        `;
    }
    
    // 生成した item を complex-use-list に append
    container.appendChild(item);
}

/**
 * 複合用途項目を削除（SOW 12.0準拠：IDベースで削除）
 */
function removeComplexUse(id) {
    const useItem = document.getElementById(`use-item-${id}`);
    if (useItem) {
        useItem.remove();
    }
}



/**
 * フォームデータを収集して建物情報オブジェクトを生成
 */
function collectData() {
    const 建物情報 = {
        主用途: document.getElementById('primary-use').value,
        延べ面積: parseFloat(document.getElementById('total-area').value) || 0,
        nanaGouJoukenFlag: (() => {
            const checked = document.querySelector('input[name="item7-condition"]:checked');
            return checked ? checked.value === 'true' : null;
        })(),
        specialConditionsFlag: (() => {
            const checked = document.querySelector('input[name="special-conditions"]:checked');
            return checked ? checked.value === 'true' : null;
        })(),
        複合用途リスト: []
    };
    
    // 複合用途のデータを収集（SOW 12.0対応：.use-item構造）
    if (建物情報.主用途 === "(16)項イ") {
        // 構成用途を収集（固定項目と通常項目の両方に対応）
        const complexUses = document.querySelectorAll('#complex-use-list .use-item');
        complexUses.forEach(useDiv => {
            // 固定項目（構成用途１）の場合はhidden inputから、通常項目はselectから取得
            const 用途 = useDiv.querySelector('input[name="complex-use-type"]')?.value || 
                        useDiv.querySelector('select[name="complex-use-type"]')?.value;
            const 面積 = parseFloat(useDiv.querySelector('input[name="complex-use-area"]')?.value || 0);
            
            if (用途 && 面積 > 0) {
                // (6)項ハの宿泊有無をプルダウンから判定
                let 入居宿泊フラグ = null;
                if (用途.startsWith('(6)項ハ')) {
                    入居宿泊フラグ = 用途.includes('（宿泊あり）');
                    // データ保存時は基本形に戻す
                    const 基本用途 = '(6)項ハ';
                    建物情報.複合用途リスト.push({
                        用途: 基本用途,
                        面積: 面積,
                        入居宿泊フラグ: 入居宿泊フラグ
                    });
                } else if (用途 === '(5)項イ') {
                    // (5)項イは常に入居・宿泊を伴う
                    建物情報.複合用途リスト.push({
                        用途: 用途,
                        面積: 面積,
                        入居宿泊フラグ: true
                    });
                } else {
                    建物情報.複合用途リスト.push({
                        用途: 用途,
                        面積: 面積,
                        入居宿泊フラグ: null
                    });
                }
            }
        });
    } else if (建物情報.主用途 === "(5)項イ") {
        // 単一用途の場合
        建物情報.複合用途リスト.push({
            用途: "(5)項イ",
            面積: 建物情報.延べ面積,
            入居宿泊フラグ: true
        });
    }
    
    return 建物情報;
}

/**
 * 判定結果を表示
 */
function displayResult(判定結果_令21, 特小判定結果, 建物情報) {
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');
    
    resultContent.innerHTML = '';
    
    // 構造化オブジェクトを取得
    const structuredResult = generateResultDescription(判定結果_令21, 特小判定結果, 建物情報);
    
    // 令第21条の判定結果カード
    const rei21Card = createStructuredResultCard(
        '自動火災報知設備の設置義務',
        structuredResult.rei21.hasObligation ? '設置義務あり' : '設置義務なし',
        structuredResult.rei21.hasObligation ? 'warning' : 'success',
        structuredResult.rei21
    );
    
    resultContent.appendChild(rei21Card);
    
    // 特小自火報の判定結果カード
    const tokushoCard = createStructuredResultCard(
        '特定小規模施設用自動火災報知設備',
        structuredResult.tokusho.applicable ? 
            (structuredResult.tokusho.canInstall ? '設置可能' : '設置不可') : 
            '判定対象外',
        structuredResult.tokusho.applicable ? 
            (structuredResult.tokusho.canInstall ? 'success' : 'error') : 
            'warning',
        structuredResult.tokusho
    );
    
    resultContent.appendChild(tokushoCard);
    
    // 入力内容の確認カード
    const inputCard = createInputSummaryCard(建物情報);
    resultContent.appendChild(inputCard);
    
    // 結果セクションを表示
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth' });
    
    // コピーボタンのイベントリスナーを設定
    setupCopyButton(判定結果_令21, 特小判定結果, 建物情報);
}

/**
 * 結果カードを作成
 */
function createResultCard(title, status, type) {
    const card = document.createElement('div');
    card.className = `result-card ${type}`;
    
    const iconMap = {
        success: 'check_circle',
        warning: 'warning',
        error: 'error'
    };
    
    card.innerHTML = `
        <div class="result-title">
            <span class="material-icons">${iconMap[type]}</span>
            ${title}
        </div>
        <div class="result-description">${status}</div>
        <div class="result-details"></div>
    `;
    
    return card;
}

/**
 * 構造化された結果カードを作成
 */
function createStructuredResultCard(title, status, type, data) {
    const card = document.createElement('div');
    card.className = `result-card ${type}`;
    
    const iconMap = {
        success: 'check_circle',
        warning: 'warning',
        error: 'error'
    };
    
    // カードのヘッダー部分
    const header = document.createElement('div');
    header.className = 'result-title';
    header.innerHTML = `
        <span class="material-icons">${iconMap[type]}</span>
        ${title}
    `;
    
    const statusDiv = document.createElement('div');
    statusDiv.className = 'result-description';
    statusDiv.textContent = status;
    
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'result-details';
    
    // 詳細内容を構築
    if (data.hasObligation === false || data.applicable === false) {
        // 設置義務なし、または判定対象外の場合
        detailsDiv.textContent = data.description;
    } else {
        // 構造化された詳細表示
        if (data.legalBasis) {
            // 法的根拠ブロックの生成
            const legalBlock = createResultBlock(
                data.legalBasis.title, 
                data.legalBasis.description,
                'gavel' // アイコン名を渡す
            );

            // 号数タグのコンテナを作成
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'legal-tags-container';
            
            // 「該当号：」ラベルを追加
            const label = document.createElement('span');
            label.className = 'legal-tags-label';
            label.textContent = '該当号：';
            tagsContainer.appendChild(label);
            
            data.legalBasis.applicableLaws.forEach(law => {
                const tag = document.createElement('span');
                tag.className = 'legal-number-tag';
                tag.textContent = law;
                tagsContainer.appendChild(tag);
            });
            legalBlock.appendChild(tagsContainer);
            detailsDiv.appendChild(legalBlock);
        }
        
        if (data.scope) {
            // 設置範囲ブロックの生成
            const scopeBlock = createResultBlock(
                data.scope.title, 
                null, // 説明文は不要
                'layers' // アイコン名を渡す
            );
            
            // サマリータグ
            const summaryTag = document.createElement('div');
            summaryTag.className = 'result-summary-tag';
            summaryTag.classList.add(data.scope.type === 'whole' ? 'result-summary-tag--whole' : 'result-summary-tag--partial');
            summaryTag.innerHTML = `
                <span class="material-icons">${data.scope.type === 'whole' ? 'business' : 'view_module'}</span>
                ${data.scope.type === 'whole' ? '建物全体' : '一部分のみ'}
            `;
            // タイトルの後にタグを追加
            scopeBlock.querySelector('.result-block-title').insertAdjacentElement('afterend', summaryTag);

            // 設置範囲の詳細リスト
            if (data.scope.details.length > 0) {
                const list = document.createElement('ul');
                list.className = 'result-block-list';
                data.scope.details.forEach(text => {
                    const li = document.createElement('li');
                    li.textContent = text;
                    list.appendChild(li);
                });
                scopeBlock.appendChild(list);
            }
            detailsDiv.appendChild(scopeBlock);
        }
        
        if (data.smallScale) {
            // 小規模特定ブロックの生成
            const smallScaleBlock = createResultBlock(
                data.smallScale.title, 
                null,
                'info'
            );
            
            // 該当・非該当タグとその他のタグを含むコンテナ
            const tagsContainer = document.createElement('div');
            tagsContainer.style.display = 'flex';
            tagsContainer.style.gap = 'var(--spacing-sm)';
            tagsContainer.style.marginBottom = 'var(--spacing-sm)';
            
            // 該当・非該当タグ
            const applicabilityTag = document.createElement('div');
            applicabilityTag.className = 'result-summary-tag';
            applicabilityTag.classList.add(data.smallScale.isApplicable ? 'result-summary-tag--applicable' : 'result-summary-tag--not-applicable');
            applicabilityTag.innerHTML = `
                <span class="material-icons">${data.smallScale.isApplicable ? 'check_circle' : 'cancel'}</span>
                ${data.smallScale.isApplicable ? '該当' : '非該当'}
            `;
            tagsContainer.appendChild(applicabilityTag);
            
            // 注意が必要な場合は注意タグを追加
            if (data.smallScale.isApplicable && data.smallScale.hasAttentionRequired) {
                const attentionTag = document.createElement('div');
                attentionTag.className = 'result-summary-tag result-summary-tag--attention';
                attentionTag.innerHTML = `
                    <span class="material-icons">warning</span>
                    注意
                `;
                tagsContainer.appendChild(attentionTag);
            }
            
            // タイトルの後にタグコンテナを追加
            smallScaleBlock.querySelector('.result-block-title').insertAdjacentElement('afterend', tagsContainer);
            
            // 該当の場合のみ詳細メッセージを表示
            if (data.smallScale.isApplicable && data.smallScale.description) {
                const content = document.createElement('p');
                content.className = 'result-block-content';
                content.textContent = data.smallScale.description;
                smallScaleBlock.appendChild(content);
            }
            
            detailsDiv.appendChild(smallScaleBlock);
        }
        
        // 特小自火報用の簡単な表示
        if (data.basis || data.reason) {
            const basisText = data.basis ? `根拠: ${data.basis}` : `理由: ${data.reason}`;
            const p = document.createElement('p');
            p.textContent = basisText;
            detailsDiv.appendChild(p);
        }
        
        // 特小自火報の判定詳細表示
        if (data.judgmentDetails && data.judgmentDetails.length > 0) {
            const detailsBlock = createResultBlock(
                '判定詳細',
                null,
                'list_alt'
            );
            
            const detailsList = document.createElement('ul');
            detailsList.className = 'judgment-details-list';
            
            data.judgmentDetails.forEach(detail => {
                const listItem = document.createElement('li');
                listItem.className = `judgment-detail-item judgment-detail-item--${detail.結果 === '該当' ? 'pass' : 'fail'}`;
                listItem.innerHTML = `
                    <div class="judgment-detail-header">
                        <span class="judgment-detail-number">${detail.号}</span>
                        <span class="judgment-detail-result">${detail.結果}</span>
                    </div>
                    <div class="judgment-detail-reason">${detail.理由}</div>
                `;
                detailsList.appendChild(listItem);
            });
            
            detailsBlock.appendChild(detailsList);
            detailsDiv.appendChild(detailsBlock);
        }
        
        // 単純な説明の場合
        if (!data.legalBasis && !data.scope && !data.specialNote && !data.basis && !data.reason && data.description) {
            detailsDiv.textContent = data.description;
        }
    }
    
    card.appendChild(header);
    card.appendChild(statusDiv);
    card.appendChild(detailsDiv);
    
    return card;
}

/**
 * 結果表示用の汎用ブロックを生成
 */
function createResultBlock(title, description, iconName = null) {
    const block = document.createElement('div');
    block.className = 'result-block';
    
    // アイコン表示に対応
    const iconHtml = iconName ? `<span class="material-icons">${iconName}</span>` : '';
    const titleElement = document.createElement('h4');
    titleElement.className = 'result-block-title';
    titleElement.innerHTML = `${iconHtml}${title}`;
    block.appendChild(titleElement);

    if (description) {
        const content = document.createElement('p');
        content.className = 'result-block-content';
        content.textContent = description;
        block.appendChild(content);
    }
    
    return block;
}

/**
 * 入力内容サマリーカードを作成
 */
function createInputSummaryCard(建物情報) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    let summary = `主用途: ${建物情報.主用途}\n`;
    summary += `延べ面積: ${建物情報.延べ面積}㎡\n`;
    summary += `7号条件: ${建物情報.nanaGouJoukenFlag ? '該当する' : '該当しない'}\n`;
    
    if (建物情報.複合用途リスト.length > 0) {
        summary += '\n構成用途:\n';
        建物情報.複合用途リスト.forEach((item, index) => {
            summary += `• ${item.用途}: ${item.面積}㎡`;
            if (item.入居宿泊フラグ !== null) {
                summary += ` (宿泊: ${item.入居宿泊フラグ ? 'あり' : 'なし'})`;
            }
            summary += '\n';
        });
    }
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'result-title';
    titleDiv.innerHTML = `
        <span class="material-icons">info</span>
        入力内容の確認
    `;
    
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'result-details';
    detailsDiv.style.whiteSpace = 'pre-wrap';
    detailsDiv.style.display = 'block';
    detailsDiv.textContent = summary;
    
    card.appendChild(titleDiv);
    card.appendChild(detailsDiv);
    
    return card;
}

/**
 * コピーボタンのイベントリスナーを設定
 */
function setupCopyButton(判定結果_令21, 特小判定結果, 建物情報) {
    const copyButton = document.getElementById('copy-result-btn');
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const markdownText = generateMarkdownResult(判定結果_令21, 特小判定結果, 建物情報);
            copyToClipboard(markdownText, copyButton);
        });
    }
}

/**
 * 判定結果をマークダウン形式で生成
 */
function generateMarkdownResult(判定結果_令21, 特小判定結果, 建物情報) {
    let markdown = '# 自動火災報知設備判定結果\n\n';
    
    // 基本情報
    markdown += '## 基本情報\n';
    markdown += `- 主用途: ${建物情報.主用途}\n`;
    markdown += `- 延べ面積: ${建物情報.延べ面積}㎡\n`;
    markdown += `- 7号条件: ${建物情報.nanaGouJoukenFlag ? '該当する' : '該当しない'}\n`;
    markdown += `- 特殊要件: ${建物情報.specialConditionsFlag ? '該当する' : '該当しない'}\n\n`;
    
    // 構成用途
    if (建物情報.複合用途リスト.length > 0) {
        markdown += '## 構成用途\n';
        建物情報.複合用途リスト.forEach(item => {
            markdown += `- ${item.用途}: ${item.面積}㎡`;
            if (item.入居宿泊フラグ !== null) {
                markdown += ` (宿泊: ${item.入居宿泊フラグ ? 'あり' : 'なし'})`;
            }
            markdown += '\n';
        });
        markdown += '\n';
    }
    
    // 令第21条判定結果
    markdown += '## 令第21条判定結果\n';
    if (判定結果_令21.根拠リスト.length > 0) {
        markdown += '設置義務: あり\n\n';
        
        // 法的根拠
        markdown += '### 法的根拠\n';
        markdown += 'この建物は消防法施行令第21条により自動火災報知設備の設置義務があります。\n';
        markdown += `該当号: ${判定結果_令21.根拠リスト.join('、')}\n\n`;
        
        // 設置範囲
        markdown += '### 設置範囲\n';
        markdown += `範囲: ${判定結果_令21.全体義務 ? '建物全体' : '一部分のみ'}\n`;
        
        if (判定結果_令21.全体義務) {
            markdown += `- 建物全体に設置義務があります（${判定結果_令21.全体義務}）\n`;
        }
        
        if (判定結果_令21.部分義務リスト.length > 0) {
            判定結果_令21.部分義務リスト.forEach(item => {
                markdown += `- ${item.対象}に設置義務があります（${item.号}）\n`;
            });
        }
        markdown += '\n';
        
        // 小規模特定用途複合防火対象物
        if (isShokiboTokutei(建物情報)) {
            markdown += '### 小規模特定用途複合防火対象物\n';
            const smallScaleDetails = getSmallScaleDetails(建物情報, 判定結果_令21, 特小判定結果);
            markdown += `該当: 該当`;
            if (smallScaleDetails.hasAttentionRequired) {
                markdown += ' (注意)';
            }
            markdown += '\n';
            if (smallScaleDetails.message) {
                markdown += `${smallScaleDetails.message}\n`;
            }
            markdown += '\n';
        }
    } else {
        markdown += '設置義務: なし\n';
        markdown += 'この建物は消防法施行令第21条による自動火災報知設備の設置義務がありません。\n\n';
    }
    
    // 特定小規模施設用自動火災報知設備判定結果
    markdown += '## 特定小規模施設用自動火災報知設備判定結果\n';
    markdown += `設置可否: ${特小判定結果.設置可否}\n`;
    markdown += `理由: ${特小判定結果.根拠}\n\n`;
    
    // 判定詳細
    if (特小判定結果.judgmentDetails && 特小判定結果.judgmentDetails.length > 0) {
        markdown += '### 判定詳細\n';
        特小判定結果.judgmentDetails.forEach(detail => {
            markdown += `- ${detail.号}: ${detail.結果} - ${detail.理由}\n`;
        });
        markdown += '\n';
    }
    
    // 生成日時
    const now = new Date();
    markdown += `---\n判定結果生成日時: ${now.toLocaleString('ja-JP')}`;
    
    return markdown;
}

/**
 * クリップボードにテキストをコピー
 */
async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        
        // ボタンの表示を一時的に変更
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="material-icons">check</span>コピー完了';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
        
    } catch (err) {
        console.error('コピーに失敗しました:', err);
        
        // フォールバック: テキストエリアを使用
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // フィードバック
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="material-icons">check</span>コピー完了';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }
}

/**
 * フォームをリセット
 */
function resetForm() {
    // フォームをリセット
    document.getElementById('building-form').reset();
    
    // 複合用途リストをクリア
    const complexUseList = document.getElementById('complex-use-list');
    if (complexUseList) {
        complexUseList.innerHTML = '';
    }
    
    // 結果セクションを非表示
    const resultSection = document.getElementById('result-section');
    if (resultSection) {
        resultSection.classList.add('hidden');
    }
    
    // カウンターをリセット
    complexUseCounter = 0;
    
    // フォームの状態を更新
    updateForm();
}

/**
 * フォーム送信処理
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    try {
        const 建物情報 = collectData();
        
        // 特殊要件チェック（最優先）
        if (建物情報.specialConditionsFlag === true) {
            showSpecialConditionsMessage();
            return; // 通常判定をスキップ
        }
        
        // SOW対応: バリデーション用の必要プロパティを動的に追加
        const 判定用建物情報 = {
            ...建物情報,
            地上階数: 1, // バリデーション用ダミー値
            地下階数: 0, // バリデーション用ダミー値 
            指定可燃物倍数: 0, // バリデーション用ダミー値
            階情報リスト: [] // バリデーション用空配列
        };
        
        // バリデーション（特殊要件が非該当の場合のみ）
        const validation = validateBuildingInfo(判定用建物情報);
        if (!validation.isValid) {
            showValidationErrors(validation.errors);
            return;
        }
        
        // 判定実行をメイン処理に委譲（判定用の完全なオブジェクトを使用）
        window.executeJudgment(判定用建物情報);
        
    } catch (error) {
        console.error('フォーム送信エラー:', error);
        showError('判定処理中にエラーが発生しました。');
    }
}

/**
 * バリデーションエラーを表示
 */
function showValidationErrors(errors) {
    const errorMessage = errors.join('\n');
    showHelpModal('入力エラー', errorMessage);
}

/**
 * エラーメッセージを表示
 */
function showError(message) {
    console.error('エラー:', message);
    // デバッグモードの場合のみアラートを表示
    if (window.appConfig && window.appConfig.debug) {
        alert(message);
    }
}

/**
 * 特殊要件メッセージを表示
 */
function showSpecialConditionsMessage() {
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');
    
    resultContent.innerHTML = '';
    
    // 特殊要件メッセージカード
    const messageCard = document.createElement('div');
    messageCard.className = 'result-card warning';
    messageCard.innerHTML = `
        <div class="result-title">
            <span class="material-icons">warning</span>
            簡易判定対象外
        </div>
        <div class="result-description">
            特殊要件に該当する場合、本ツールでの簡易判定は行えません。個別検討が必要です。
        </div>
        <div class="result-details">
            詳細については所轄消防署にお問い合わせください。
        </div>
    `;
    
    resultContent.appendChild(messageCard);
    
    // 結果セクションを表示
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * ヘルプクリック処理
 */
function handleHelpClick(event) {
    const helpIcon = event.target.closest('.help-icon');
    if (helpIcon) {
        const helpText = helpIcon.dataset.help;
        showHelpModal('ヘルプ', helpText);
    }
}

/**
 * ヘルプモーダルを表示
 */
function showHelpModal(title, content) {
    const modal = document.getElementById('help-modal');
    const titleElement = document.getElementById('help-title');
    const contentElement = document.getElementById('help-content');
    
    titleElement.textContent = title;
    // 改行文字を<br>タグに変換
    contentElement.innerHTML = content.replace(/\n/g, '<br>');
    modal.classList.add('show');
}

/**
 * ヘルプモーダルを非表示
 */
function hideHelpModal() {
    const modal = document.getElementById('help-modal');
    modal.classList.remove('show');
}


// DOMContentLoaded時に初期化
document.addEventListener('DOMContentLoaded', init);