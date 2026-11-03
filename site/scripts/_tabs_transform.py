import re,sys
p=sys.argv[1]; s=open(p,encoding='utf-8').read()
W0=s.index('    <!-- ============ 03 SELECTED WORK ============ -->')
C0=s.index('    <!-- ============ 04 CLIENT DELIVERY ============ -->')
F0=s.index('    <!-- ============ 05 FIELD RECORD ============ -->')
W=s[W0:C0]; C=s[C0:F0]
gate_re=re.compile(r'\n        <div class="gate reveal">.*?</div>\n',re.S)
assert len(gate_re.findall(W))==1 and len(gate_re.findall(C))==1
W=gate_re.sub('\n',W); C=gate_re.sub('\n',C)
W=W.replace('<!-- ============ 03 SELECTED WORK ============ -->','<!-- ------ panel: independent work ------ -->')
C=C.replace('<!-- ============ 04 CLIENT DELIVERY ============ -->','<!-- ------ panel: client delivery ------ -->')
W=W.replace('<section class="block chapter" id="work">','<section class="work-panel" id="independent-work" role="tabpanel" aria-labelledby="tab-independent" hidden>',1)
C=C.replace('<section class="block chapter client-delivery" id="client-delivery">','<section class="work-panel client-delivery" id="client-delivery" role="tabpanel" aria-labelledby="tab-client">',1)
for a,b in (('<p class="cap accent reveal">03 · Independent work</p>','<p class="cap work-panel-label">Independent work · research and personal builds</p>'),
            ('<p class="cap accent reveal">04 · Client delivery</p>','<p class="cap work-panel-label">Client delivery · Perfect10 and client engagements</p>')):
    assert (a in W) or (a in C),a; W=W.replace(a,b); C=C.replace(a,b)
n_client=C.count('class="portfolio-scene client-scene'); n_ind=W.count('class="portfolio-scene reveal"')
wrapper=f'''    <!-- ============ 03 SELECTED WORK ============ -->
    <section class="block chapter selected-work" id="work">
      <div class="wrap">
        <p class="cap accent reveal">03 · Selected work</p>
        <div class="work-tabs" role="tablist" aria-label="Selected work">
          <button type="button" class="work-tab" role="tab" id="tab-client" aria-controls="client-delivery" aria-selected="true">Client delivery <span class="work-tab-count">{n_client}</span></button>
          <button type="button" class="work-tab" role="tab" id="tab-independent" aria-controls="independent-work" aria-selected="false" tabindex="-1">Independent work <span class="work-tab-count">{n_ind}</span></button>
        </div>
      </div>

{C}{W}      <div class="wrap">
        <div class="gate reveal">
          <span class="gate-line"></span>
          <span class="gate-label">Selected work · evidence inspected</span>
          <span class="gate-dot"></span>
        </div>
      </div>
    </section>

'''
s=s[:W0]+wrapper+s[F0:]
for a,b in (('05 · Field record','04 · Field record'),('06 · Working fit','05 · Working fit'),('07 · Contact','06 · Contact'),
            ('<!-- ============ 05 FIELD RECORD','<!-- ============ 04 FIELD RECORD'),('<!-- ============ 06 WORKING FIT','<!-- ============ 05 WORKING FIT'),('<!-- ============ 06 MODEL CARD','<!-- ============ 06 MODEL CARD')):
    s=s.replace(a,b)
tag='  <script src="js/project-scene-motion.js'
assert tag in s
s=s.replace(tag,'  <script src="js/work-tabs.js?v=20261103a" defer></script>\n'+tag,1)
open(p,'w',encoding='utf-8').write(s); print('ok',n_client,n_ind)
