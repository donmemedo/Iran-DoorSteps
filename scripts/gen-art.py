import os, random, sys
out = sys.argv[1]
os.makedirs(out, exist_ok=True)

PAL = [(268, 198), (200, 320), (150, 200), (24, 340), (190, 265), (330, 25), (95, 180), (285, 205)]

def cover(i, h1, h2, seed):
    r = random.Random(seed)
    W, H = 960, 720
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
         f'<defs><linearGradient id="sky" x1="0" y1="0" x2="0.4" y2="1">'
         f'<stop offset="0" stop-color="hsl({h1},80%,68%)"/><stop offset="0.55" stop-color="hsl({(h1+h2)//2},72%,58%)"/>'
         f'<stop offset="1" stop-color="hsl({h2},70%,38%)"/></linearGradient>'
         f'<linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl({h2},40%,96%)" stop-opacity=".95"/>'
         f'<stop offset="1" stop-color="hsl({h2},45%,72%)" stop-opacity=".9"/></linearGradient>'
         f'<radialGradient id="sun"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>',
         f'<rect width="{W}" height="{H}" fill="url(#sky)"/>',
         f'<circle cx="{r.randint(150,800)}" cy="{r.randint(90,220)}" r="{r.randint(110,190)}" fill="url(#sun)"/>']
    # soft hills
    p.append(f'<path d="M0 {H*0.62:.0f} Q {W*0.25:.0f} {H*0.50:.0f} {W*0.5:.0f} {H*0.60:.0f} T {W} {H*0.56:.0f} V {H} H0 Z" fill="hsl({h2},55%,30%)" opacity=".22"/>')
    x = -20
    while x < W:
        bw = r.randint(70, 160)
        bh = r.randint(150, 400)
        top = H - 130 - bh
        depth = r.choice([0.9, 1.0, 1.0, 1.1])
        p.append(f'<rect x="{x}" y="{top}" width="{bw}" height="{bh+140}" rx="10" fill="url(#g2)" opacity="{0.55*depth:.2f}"/>')
        for wy in range(int(top) + 26, H - 150, 42):
            for wx in range(x + 16, x + bw - 18, 34):
                if r.random() > 0.28:
                    p.append(f'<rect x="{wx}" y="{wy}" width="16" height="22" rx="4" fill="hsl({h1},90%,{r.randint(72,96)}%)" opacity="{r.uniform(.35,.9):.2f}"/>')
        x += bw + r.randint(10, 34)
    p.append(f'<rect y="{H-130}" width="{W}" height="130" fill="hsl({h2},50%,24%)" opacity=".35"/>')
    p.append(f'<rect width="{W}" height="{H}" fill="hsl({h1},60%,10%)" opacity=".08"/>')
    p.append('</svg>')
    open(os.path.join(out, f'a{i}.svg'), 'w').write(''.join(p))

for i, (h1, h2) in enumerate(PAL, 1):
    cover(i, h1, h2, 43 + i)

# editorial tip covers: abstract arcs
for i in range(1, 5):
    h1, h2 = PAL[(i * 2) % len(PAL)]
    r = random.Random(100 + i)
    W, H = 900, 560
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
         f'<defs><linearGradient id="b{i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl({h1},85%,62%)"/><stop offset="1" stop-color="hsl({h2},80%,44%)"/></linearGradient></defs>',
         f'<rect width="{W}" height="{H}" fill="url(#b{i})"/>']
    for k in range(7):
        s.append(f'<circle cx="{r.randint(0,W)}" cy="{r.randint(0,H)}" r="{r.randint(60,260)}" fill="none" stroke="#fff" stroke-width="{r.randint(2,10)}" opacity="{r.uniform(.08,.3):.2f}"/>')
    s.append(f'<path d="M0 {H} L{W*0.4:.0f} {H*0.35:.0f} L{W*0.7:.0f} {H} Z" fill="#fff" opacity=".12"/>')
    s.append('</svg>')
    open(os.path.join(out, f't{i}.svg'), 'w').write(''.join(s))
print("svgs", len(os.listdir(out)))
