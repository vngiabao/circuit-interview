# Readable teaching figures

Built from the current `Interview Website` source, based on main at `3089b6c`.

- Arithmetic now leads with eight visually reviewed original EECS 427 crops: prefix notation, Kogge–Stone, Brent–Kung, architecture tradeoffs, Booth recoding and selection, carry-save reduction, and a Wallace tree. The adder lesson also exposes its four relevant course crops. Original captions and files remain intact.
- Lecture figures appear before generated figures in lesson readers. Dense block and prefix diagrams span a full row rather than sharing narrow columns. Mobile captions explicitly invite enlargement.
- RTL-to-GDS uses a numbered implementation path and separate dashed STA inputs. Barrel shifting uses a vertical data path with individually labelled control bits. Booth and carry-save reduction use a simple serpentine sequence. Prefix-network supplements now define filled/open symbols and wire direction.
- New regressions reject arrow crossings, overlapping routes and merged ports in those four affected flows, in addition to existing box collision checks. All 69 structural generators retain their expected node/edge/terminal connections.
- All 534 indexed lecture crops, 22 direct lesson images, source data and Oura palette tokens are unchanged. No archive files were copied or published.

Validation: technical, content, state/Python, lesson/media and figure-coverage checks pass; Impeccable reports zero findings. Browser sweeps cover 1,536 states per theme/viewport, including the real lesson, question, answer, lab and domain renderers. Dark/light at 1280px and 375px pass without runtime errors, page overflow or clipped SVG labels.

Independent source review caught and corrected the Booth caption to use the actual slide's multiplicand `Y`. There is no matching barrel-shifter or RTL-to-GDS snapshot in the indexed lecture crops; those remain original illustrative diagrams.
