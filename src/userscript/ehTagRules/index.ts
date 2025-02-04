// 使用 i18n-ally 扩展查看对应的中文翻译

// 有些情况下无法判断具体的性别命名空间，只能使用 `(x|f):` 的格式来限定范围

// 概率标签的标准：有A标签的本子中，只有 10% 的本子没有 B 标签
// 「`A标签 -B标签` 的搜索结果数」<「`A标签` 的搜索结果数」的 10%
// `A标签 -B标签` 的搜索结果里也一堆漏标B标签的除外

// 有没有必要加上复杂规则呢？
// - 组合标签
//   - 单扶她 + 单女主 = 大概率「扶上女」
// - 根据条件将「大概率」限定为「必须」
//   - 单萝莉 + 贫乳 + (单女主) = 肯定无法共存
// - 把画廊类型也加进标签，方便过滤 CG 集等图库
//   （虽说现在的 possibleConflict 已经这么过滤了

const rules = {
  // 存在第二个标签时，必须同时存在第一个标签
  // 主要是各种前置标签
  prerequisite: {
    // 乱伦
    '(x|f):incest': [
      'f:cousin',
      'f:aunt',
      'f:daughter',
      'f:mother',
      'f:granddaughter',
      'f:sister',
      'f:grandmother',
      'f:niece',
    ],
    '(x|m):incest': ['m:cousin'],
    'f:incest': ['f:inseki', 'f:low_incest'],
    'm:incest': ['m:inseki', 'm:low_incest'],
    'x:incest': ['x:inseki', 'x:low_incest'],

    // 女性乱交
    'f:group': [
      'f:fff_threesome',
      'f:ttt_threesome',
      'f:fft_threesome',
      'f:ttf_threesome',
    ],
    // 男性乱交
    'm:group': ['m:mmm_threesome'],
    // 混合性别的乱交
    'x:group': [
      'x:mmf_threesome',
      'x:mmt_threesome',
      'x:ttm_threesome',
      'x:ffm_threesome',
      'x:mtf_threesome',
      'x:oyakodon',
      'x:shimaidon',
      'x:gang_rape',
    ],
    // 无法限定性别的乱交
    '(x|f):group': [
      'f:oyakodon',
      'f:shimaidon',
      'f:multiple_straddling',
      'f:gang_rape',
      'f:layer_cake',
      'f:harem',
    ],
    '(x|m):group': [
      'm:oyakodon',
      'm:shimaidon',
      'm:multiple_straddling',
      'm:gang_rape',
      'm:layer_cake',
      'm:harem',
    ],

    'f:yuri': ['f:fff_threesome'],
    'm:yaoi': ['m:group', 'm:mmm_threesome'],

    'f:futanari': [
      'f:ttt_threesome',
      'f:fft_threesome',
      'f:ttf_threesome',
      'f:full-packaged_futanari',
    ],
    'f:shemale': ['f:ball-less_shemale'],
    'f:lolicon': [
      'f:kodomo_doushi',
      'x:kodomo_doushi',
      'f:oppai_loli',
      'f:mesugaki',
      'f:low_lolicon',
    ],
    'm:shotacon': ['m:kodomo_doushi', 'x:kodomo_doushi'],

    'f:blowjob': [
      'f:multimouth_blowjob',
      'f:blowjob_face',
      'f:deepthroat',
      'f:focus_blowjob',
    ],
    'm:blowjob': [
      'm:multimouth_blowjob',
      'm:blowjob_face',
      'm:deepthroat',
      'm:focus_blowjob',
    ],
    'f:handjob': ['f:multiple_handjob'],
    'm:handjob': ['m:multiple_handjob'],
    'f:assjob': ['f:multiple_assjob'],
    'm:assjob': ['m:multiple_assjob'],
    'f:footjob': ['f:multiple_footjob'],
    'm:footjob': ['m:multiple_footjob'],
    'f:paizuri': ['f:focus_paizuri'],
    'm:paizuri': ['m:focus_paizuri'],
    'f:anal': ['f:focus_anal', 'f:anal_intercourse', 'f:tail_plug'],
    'm:anal': ['m:focus_anal', 'm:anal_intercourse', 'm:tail_plug'],
    'f:rape': ['f:gang_rape'],
    'm:rape': ['m:gang_rape'],

    'f:bondage': ['f:fanny_packing', 'f:shibari'],
    'm:bondage': ['m:fanny_packing', 'm:shibari'],
    'f:inflation': ['f:cumflation'],
    'm:inflation': ['m:cumflation'],
    'f:lactation': ['f:milking'],
    'm:lactation': ['m:milking'],
    'f:piercing': ['f:nipple_piercing', 'f:genital_piercing'],
    'm:piercing': ['m:nipple_piercing', 'm:genital_piercing'],

    'f:big_breasts': ['f:huge_breasts', 'f:gigantic_breasts'],
    'f:huge_breasts': ['f:gigantic_breasts'],

    'f:sex_toys': ['f:tail_plug'],
    'm:sex_toys': ['m:tail_plug'],

    'f:swimsuit': ['f:bikini'],
    'm:swimsuit': ['m:bikini'],

    'f:crossdressing': ['f:schoolboy_uniform'],

    'f:monster_girl': ['f:zombie'],
  },

  // 存在第一个标签时，就不应该存在其他标签
  conflict: {
    // 纯女性
    'f:females_only': [
      'f:futanari',
      'f:bisexual',
      'f:ttt_threesome',
      'f:fft_threesome',
      'f:ttf_threesome',
      'x:mmf_threesome',
      'x:mmt_threesome',
      'x:ttm_threesome',
      'x:mtf_threesome',
      'x:group',
      'm:*',
      'x:*',
    ],
    // 单女主
    'f:sole_female': [
      'f:ttt_threesome',
      'f:fft_threesome',
      'x:mmt_threesome',
      'x:ttm_threesome',
      'm:mmm_threesome',
    ],
    // 单扶她
    'f:sole_dickgirl': [
      'f:fff_threesome',
      'f:ttt_threesome',
      'f:ttf_threesome',
      'x:mmf_threesome',
      'x:ttm_threesome',
      'm:mmm_threesome',
    ],
  },

  // 存在第一个标签时，「大概率」不可能存在第二个标签
  // 主要是各种容易搞混的，以为应该共存实际上是二选一的标签
  // 只不过因为可能同时存在多个角色，所以只能是「大概率」
  possibleConflict: {
    'f:dark_skin': ['f:tanlines'],
    'm:dark_skin': ['m:tanlines'],
    'f:lolicon': ['f:small_breasts'],
    'f:breast_feeding': ['f:nipple_stimulation'],
  },

  // 存在第一个标签时，「大概率」可能存在第二个标签
  // 如果第二个标签含有前置标签，则应该省略，以便减少标签数增加可读性
  combo: {
    'f:horse_girl': ['f:kemonomimi', 'f:tail'],
    'f:dog_girl': ['f:kemonomimi'],
    'f:mouse_girl': ['f:kemonomimi'],
    'f:bunny_girl': ['f:kemonomimi', 'f:leotard'],
    'f:catgirl': ['f:kemonomimi'],
    'f:cowgirl': ['f:kemonomimi'],
    'f:oni': ['f:horns'],

    // 作品
    'p:uma_musume_pretty_derby': ['f:horse_girl'],
    'p:blue_archive': ['f:halo'],
    'p:zombie_land_saga': ['f:zombie'],

    // 角色

    // LL
    'c:ayumu_uehara': ['f:hair_buns'],
    'c:yu_takasaki': ['f:twintails'],

    'c:rurino_osawa': ['f:twintails'],
    'c:sayaka_murano': ['f:twintails'],
    'c:hime_anyoji': ['f:ponytail'],

    'c:nico_yazawa': ['f:twintails'],
    'c:eli_ayase': ['f:ponytail'],
    'c:nozomi_tojo': ['f:twintails'],
    'c:honoka_kosaka': ['f:ponytail'],

    'c:ruby_kurosawa': ['f:twintails'],
    'c:yoshiko_tsushima': ['f:hair_buns'],
    'c:kanan_matsuura': ['f:ponytail'],
    'c:ria_kazuno': ['f:twintails'],
    'c:seira_kazuno': ['f:ponytail'],

    'c:chisato_arashi': ['f:hair_buns'],
    'c:ren_hazuki': ['f:ponytail'],

    // bang dream
    'c:arisa_ichigaya': ['f:twintails'],
    'c:saaya_yamabuki': ['f:ponytail'],

    'c:himari_uehara': ['f:twintails'],
    'c:ako_udagawa': ['f:twintails'],

    'c:reona_nyubara': ['f:twintails'],

    'c:tsukushi_futaba': ['f:twintails'],

    // 孤独摇滚
    'c:hitori_gotou': ['f:very_long_hair'],
    'c:nijika_ijichi': ['f:ponytail', 'f:very_long_hair'],

    // 方舟
    'c:amiya': ['f:kemonomimi'],
    'c:rosmontis': ['f:kemonomimi'],
    'c:suzuran': ['f:lolicon', 'f:kemonomimi', 'f:tail'],
    'c:shamare': ['f:lolicon', 'f:kemonomimi'],
    'c:schwarz': ['f:kemonomimi', 'f:ponytail', 'f:tail'],
    'c:ceylon': ['f:hair_buns'],

    // other
    'c:remilia_scarlet': ['f:wings', 'f:vampire'],
    'c:flandre_scarlet': ['f:wings', 'f:vampire'],
    'c:koakuma': ['f:wings', 'f:demon_girl'],
    'c:yuko_yoshida': ['f:horns', 'f:tail', 'f:demon_girl'],
    'c:suletta_mercury': ['f:thick_eyebrows'],
    'c:junna_hoshimi': ['f:glasses'],
    'c:euphyllia_magenta': ['f:very_long_hair'],
    'c:misuzu_hataya': ['f:beauty_mark'],
    'c:kotone_fujita': ['f:twintails'],
    'c:mizuki_akiyama': ['m:crossdressing'],
  },
};

export const getTagLintRules = () => {
  const shortNamespace = new Map<RegExp, string>(
    (
      [
        ['p', 'parody'],
        ['c', 'character'],
        ['g', 'group'],
        ['a', 'artist'],
        ['m', 'male'],
        ['f', 'female'],
        ['x', 'mixed'],
        ['o', 'other'],
      ] as Array<[string, string]>
    ).map(([short, full]) => [new RegExp(`\\b${short}\\b(?=.*:)`), full]),
  );
  // 将缩写的命名空间转回全拼
  const getTagName = (tag: string) => {
    let fullTag = tag;
    for (const re of shortNamespace.keys())
      if (re.test(fullTag)) {
        fullTag = fullTag.replace(re, shortNamespace.get(re)!);
      }
    return fullTag;
  };

  const createRuleMap = (map: Record<string, string[]>, reverse = false) => {
    const ruleMap = new Map<string, Set<string>>();
    if (reverse)
      for (let [targetTag, tags] of Object.entries(map)) {
        targetTag = getTagName(targetTag);
        for (let tag of tags) {
          tag = getTagName(tag);
          if (ruleMap.has(tag)) ruleMap.get(tag)!.add(targetTag);
          else ruleMap.set(tag, new Set([targetTag]));
        }
      }
    else
      for (const [tag, targetTag] of Object.entries(map))
        ruleMap.set(getTagName(tag), new Set(targetTag.map(getTagName)));
    return ruleMap;
  };

  return {
    prerequisite: createRuleMap(rules.prerequisite, true),
    conflict: createRuleMap(rules.conflict),
    possibleConflict: createRuleMap(rules.possibleConflict),
    // 写的时候为了可以根据不同作品分类而没有反转
    // 但为了减少代码，在打包时反转了下，所以在用时得再反转回去
    combo: createRuleMap(rules.combo, true),
  };
};

/** 拆分多个命名空间的标签 */
export const splitTagNamespace = (tag: string) => {
  if (!tag.startsWith('(')) return [tag];
  const [, namespaces, tagName] = /\((.+?)\)(.+)/.exec(tag)!;
  return namespaces.split('|').map((namespace) => `${namespace}${tagName}`);
};

/** 判断是否缺少指定命名空间下的标签 */
export const isMissingNamespace = (
  tagList: Set<string>,
  ...namespaces: string[]
) => {
  for (const namespace of namespaces)
    for (const tag of tagList) if (tag.startsWith(namespace)) return false;
  return true;
};

/** 检查标签是否存在 */
export const hasTag = (tagList: Set<string>, tagName: string) => {
  if (tagName.startsWith('('))
    for (const tag of splitTagNamespace(tagName))
      if (tagList.has(tag)) return true;
  if (tagName.endsWith(':*'))
    return !isMissingNamespace(tagList, tagName.split(':*')[0]);
  return tagList.has(tagName);
};

/** 判断是否缺少指定标签 */
export const isMissingTags = (tagList: Set<string>, ...tags: string[]) => {
  for (const tag of tags) if (tagList.has(tag)) return false;
  return true;
};
