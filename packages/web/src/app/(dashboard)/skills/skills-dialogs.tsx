'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { authFetch } from '@/lib/auth';

const NAME_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// ------------------------------------------------------------------ //
//  Skill scaffold template                                            //
// ------------------------------------------------------------------ //

const SKILL_CONTENT_TEMPLATE = (name: string, description: string) => `---
name: ${name || 'my-skill'}
description: ${description || 'What this skill does and when the agent should use it.'}
version: 1.0.0
author: AIbyML Org
tags: []
---

# ${name || 'My Skill'}

## Purpose
[What problem this skill solves and when the agent should load it]

## Key Features
- [Feature 1]
- [Feature 2]
- [Feature 3]

## Usage
1. **Initialize**: [Any setup or API keys needed]
2. **Run**: [How to invoke the main script or workflow]
3. **Output**: [What the agent produces]

## Workflow
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Tools used
- Use \`shell\` to run scripts in \`scripts/\`
- Use \`read_file\` / \`write_file\` for workspace files
- Use \`web_search\` / \`web_fetch\` if external data is needed

## Constraints
- [What this skill should never do]
- Always confirm before overwriting existing files
`.trimEnd();

// ------------------------------------------------------------------ //
//  Sample skill examples                                              //
// ------------------------------------------------------------------ //

interface SkillSample {
  label: string;
  name: string;
  description: string;
  content: string;
}

const SKILL_SAMPLES: SkillSample[] = [
  {
    label: 'Image → Video (Gemini + Banana API)',
    name: 'create-video-from-images',
    description: 'Convert uploaded PNG or JPG images into an 8-second short video using Gemini and Banana API. Use when the user asks to turn a set of images into a short video clip.',
    content: `---
name: create-video-from-images
description: Convert uploaded PNG or JPG images into an 8-second short video using Gemini and Banana API. Use when the user asks to turn a set of images into a short video clip.
version: 1.0.0
author: AIbyML Org
tags: [video, conversion, gemini, banana, images]
---

# Create Video from Images

## Purpose
Convert a collection of PNG or JPG images into an 8-second short video by uploading them to the Banana API and triggering video synthesis via the Gemini platform.

## Key Features
- Accepts image uploads in PNG or JPG format from /workspace
- Interfaces with Banana API for image upload and job queuing
- Uses Gemini API to synthesize frames into a timed video
- Downloads the completed video back to /workspace

## Requirements
- \`BANANA_API_KEY\` and \`GEMINI_API_KEY\` must be set in the workspace environment or passed by the user
- Python 3 with \`requests\` installed (available in the agent container)

## Usage
1. **Prepare images**: Place PNG/JPG files in /workspace/images/
2. **Run script**: \`python3 /workspace/skills/create-video-from-images/scripts/upload_and_convert.py\`
3. **Retrieve video**: The output video is saved to /workspace/output/video.mp4

## Workflow
1. List images in /workspace/images/ using \`list_directory\`
2. Run \`upload_and_convert.py\` via \`shell\` — it uploads images and polls for completion
3. On success, the video is saved to /workspace/output/
4. Confirm the file exists with \`read_file\` or \`list_directory\`

## Tools
- Use \`shell\` to run \`upload_and_convert.py\`
- Use \`list_directory\` to confirm images exist before running
- Use \`read_file\` to inspect logs if the script fails
- Use \`search_memory\` to recall any saved API keys the user has previously provided

## Constraints
- Do not hardcode API keys in scripts — read them from environment variables
- Do not upload more than 20 images per run (API limit)
- Always confirm the output file exists before reporting success to the user

## Script reference
See \`scripts/upload_and_convert.py\` for the full implementation.`,
  },
  {
    label: 'Images → PowerPoint Template (python-pptx)',
    name: 'create-ppt-from-images',
    description: 'Convert a set of PNG or JPG images into a PowerPoint presentation template, arranging images into slides with suggested titles. Use when the user wants to build a presentation from photos or activity images.',
    content: `---
name: create-ppt-from-images
description: Convert a set of PNG or JPG images into a PowerPoint presentation template, arranging images into slides with suggested titles. Use when the user wants to build a presentation from photos or activity images.
version: 1.0.0
author: AIbyML Org
tags: [powerpoint, presentation, images, pptx, conversion]
---

# Create PowerPoint from Images

## Purpose
Automatically arrange a folder of PNG/JPG images into a professional PowerPoint template, one image per slide, with auto-generated title placeholders. Useful for company activity reports, event recaps, and stakeholder presentations.

## Key Features
- Accepts all PNG/JPG/JPEG files from a specified folder in /workspace
- Places each image on a blank slide with a suggested title
- Saves the completed .pptx to /workspace/output/
- Uses python-pptx — no external API or internet connection required

## Requirements
- Python 3 with \`python-pptx\` and \`Pillow\` installed
  - Install if missing: \`pip install python-pptx Pillow\`

## Usage
1. **Prepare images**: Place PNG/JPG files in /workspace/images/
2. **Run script**: \`python3 /workspace/skills/create-ppt-from-images/scripts/generate_ppt.py\`
3. **Find output**: Saved to /workspace/output/company_presentation.pptx

## Workflow
1. Confirm images exist: use \`list_directory\` on /workspace/images/
2. Run the script via \`shell\`
3. Verify the .pptx file was created with \`list_directory\` on /workspace/output/
4. Offer to rename slides or add captions by editing the script parameters

## Tools
- Use \`shell\` to install dependencies and run \`generate_ppt.py\`
- Use \`list_directory\` to inspect /workspace/images/ before running
- Use \`edit_file\` to adjust slide titles or layout settings in the script
- Use \`write_file\` to create a simple image manifest if the user wants a specific slide order

## Constraints
- Supported formats: .png, .jpg, .jpeg only
- Images are resized to fit the slide (8×6 inches) — original files are not modified
- Do not overwrite an existing presentation without confirming with the user

## Script reference
See \`scripts/generate_ppt.py\` for the full implementation.`,
  },
  {
    label: 'OCR + Question Answering (pytesseract)',
    name: 'ocr-and-question-answering',
    description: 'Extract text from PNG or JPG images using OCR (pytesseract) and answer questions based on the extracted content. Use when the user uploads a scanned document, receipt, form, or image containing text and wants to query it.',
    content: `---
name: ocr-and-question-answering
description: Extract text from PNG or JPG images using OCR (pytesseract) and answer questions based on the extracted content. Use when the user uploads a scanned document, receipt, form, or image containing text and wants to query it.
version: 1.0.0
author: AIbyML Org
tags: [ocr, question-answering, image, text-extraction, documents]
---

# OCR and Question Answering

## Purpose
Convert images containing printed or typed text into machine-readable text using Tesseract OCR, then allow the user to ask natural-language questions about the content — dates, names, totals, clauses, or any information visible in the image.

## Key Features
- Accepts PNG/JPG images from /workspace
- Extracts text using pytesseract (wraps Tesseract OCR engine)
- Saves extracted text to /workspace/output/<image_name>.txt
- Answers user questions based on extracted content using the agent's own reasoning

## Requirements
- Tesseract OCR must be installed in the container:
  \`apt-get install -y tesseract-ocr\`
- Python 3 with \`pytesseract\` and \`Pillow\`:
  \`pip install pytesseract Pillow\`

## Usage
1. **Prepare image**: Place the image in /workspace/images/
2. **Run OCR**: \`python3 /workspace/skills/ocr-and-question-answering/scripts/ocr_extract.py /workspace/images/<filename>\`
3. **Read result**: Extracted text is saved to /workspace/output/<filename>.txt
4. **Answer questions**: Read the .txt file and use your reasoning to answer the user's question

## Workflow
1. Confirm the image exists: \`list_directory\` on /workspace/images/
2. Install dependencies if needed via \`shell\`
3. Run \`ocr_extract.py\` via \`shell\` — outputs a .txt file
4. \`read_file\` the .txt to load the extracted text into context
5. Answer the user's question by reasoning over the text — no extra API call needed

## Tools
- Use \`shell\` to install Tesseract/dependencies and run the OCR script
- Use \`list_directory\` to check that the image file exists first
- Use \`read_file\` to load the extracted .txt into context for question answering
- Use \`write_file\` if you need to save the Q&A results for the user

## Constraints
- OCR accuracy depends on image quality — warn the user if the image is low-resolution or handwritten
- Handwriting recognition is limited; recommend a dedicated handwriting model for cursive text
- Do not send image data to any external API — all processing is local inside the container
- Always show the extracted text to the user before answering questions so they can spot OCR errors

## Script reference
See \`scripts/ocr_extract.py\` for the full implementation.`,
  },
  {
    label: 'NGO Field Report Compiler',
    name: 'ngo-field-report-compiler',
    description: 'Compile structured field reports from raw notes, photos, and data files in the workspace. Use when a field officer needs to turn unstructured observations into a formatted impact report for donors or management.',
    content: `---
name: ngo-field-report-compiler
description: Compile structured field reports from raw notes, photos, and data files in the workspace. Use when a field officer needs to turn unstructured observations into a formatted impact report for donors or management.
version: 1.0.0
author: AIbyML Org
tags: [ngo, reporting, field-ops, donors, impact]
---

# NGO Field Report Compiler

## Purpose
Transform raw field notes, activity logs, and supporting files into a professionally structured impact report. The report follows the organisation's standard format: executive summary, activities, beneficiary numbers, challenges, and next steps.

## Key Features
- Reads unstructured notes and CSV data from /workspace/field-data/
- Structures content into the standard NGO report template
- Applies aria-foundation communication principles (audience-calibrated tone, dignity in storytelling)
- Saves the final report as a .md or .docx file to /workspace/output/

## Skills loaded alongside this skill
- Load \`aria-foundation\` for donor communication tone, impact framing, and ethical standards

## Usage
1. **Prepare data**: Place field notes (.txt/.md) and any CSV data in /workspace/field-data/
2. **Run**: Ask the agent "compile the field report from /workspace/field-data/"
3. **Review**: The draft report is saved to /workspace/output/field-report-<date>.md
4. **Iterate**: Ask for changes to specific sections before finalising

## Workflow
1. \`list_directory\` on /workspace/field-data/ to inventory available files
2. \`read_file\` each source file to load content into context
3. Structure into the standard report template (sections below)
4. Apply aria-foundation tone guidance for the intended audience (default: institutional donor)
5. \`write_file\` the compiled report to /workspace/output/

## Standard report sections
1. **Executive Summary** (3–5 sentences, outputs + key outcome)
2. **Programme Activities** (what was done, where, who delivered it)
3. **Beneficiaries Reached** (numbers, demographics — never identify individuals without consent)
4. **Key Outcomes** (changes observed; distinguish from outputs)
5. **Challenges & Lessons** (honest; what did not go as planned)
6. **Next Steps** (what happens in the next reporting period)
7. **Budget Utilisation** (high-level only; flag if actuals deviate from plan)

## Tools
- Use \`list_directory\` to inventory /workspace/field-data/ before starting
- Use \`read_file\` to load each source document into context
- Use \`write_file\` to save the completed report
- Use \`web_search\` only if the user asks for sector benchmarks or external references

## Constraints
- Never identify individual beneficiaries by name without explicit consent noted in the source file
- Do not inflate output numbers — use exactly what the source data shows
- Always distinguish outputs from outcomes; never conflate the two
- Flag any data gaps to the user before finalising the report`,
  },
];

// ------------------------------------------------------------------ //
//  Create Skill Dialog                                                //
// ------------------------------------------------------------------ //

export function CreateDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [contentOpen, setContentOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!open) {
      setName('');
      setDescription('');
      setContent('');
      setContentOpen(false);
      setErr('');
    }
  }, [open]);

  const loadSample = (label: string) => {
    const sample = SKILL_SAMPLES.find((s) => s.label === label);
    if (!sample) return;
    setName(sample.name);
    setDescription(sample.description);
    setContent(sample.content);
    setContentOpen(true);
  };

  const loadTemplate = () => {
    setContent(SKILL_CONTENT_TEMPLATE(name, description));
    setContentOpen(true);
  };

  const handleSubmit = async () => {
    setErr('');
    if (!NAME_REGEX.test(name)) {
      setErr('Name must be lowercase alphanumeric with hyphens.');
      return;
    }
    if (description.trim().length === 0) {
      setErr('Description is required.');
      return;
    }
    setSaving(true);
    try {
      await authFetch('/api/v1/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });
      if (content.trim().length > 0) {
        await authFetch(`/api/v1/skills/${name.trim()}/content`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: content.trim() }),
        });
      }
      setName('');
      setDescription('');
      setContent('');
      setContentOpen(false);
      onCreated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to create skill');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto !w-[56vw] !max-w-none">
        <DialogHeader>
          <DialogTitle>Create skill</DialogTitle>
          <DialogDescription>
            Scaffolds a new skill under <code>/skills/&lt;name&gt;/SKILL.md</code> in your
            workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Skill name</label>
            <Input
              placeholder="skill-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">
              Lowercase, hyphens only, max 64 chars (e.g. <code>ocr-and-question-answering</code>)
            </p>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <Textarea
              placeholder="What does this skill do, and when should the agent use it?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <p className="text-[11px] text-muted-foreground">
              This is the agent&apos;s trigger — be specific about when to load this skill.
            </p>
          </div>

          {/* Template / Example controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadTemplate}
              className="flex items-center gap-1 rounded border px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Wand2 className="size-3" />
              Use template
            </button>
            <span className="text-xs text-muted-foreground">or load an example:</span>
            <select
              className="flex-1 rounded border bg-background px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              value=""
              onChange={(e) => loadSample(e.target.value)}
            >
              <option value="" disabled>Select example…</option>
              {SKILL_SAMPLES.map((s) => (
                <option key={s.name} value={s.label}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Collapsible SKILL.md editor */}
          <div className="rounded-md border text-xs">
            <button
              type="button"
              onClick={() => setContentOpen((v) => !v)}
              className="flex w-full items-center justify-between px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <span className="font-medium">
                SKILL.md content {content.trim() ? '(customised)' : '(optional — auto-generated if blank)'}
              </span>
              <ChevronDown className={`size-3.5 transition-transform ${contentOpen ? 'rotate-180' : ''}`} />
            </button>
            {contentOpen && (
              <div className="border-t p-2">
                <p className="mb-2 px-1 text-muted-foreground">
                  Edit the full SKILL.md before creating. Leave blank to use the default scaffold — you can always edit it afterwards.
                </p>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[40vh] font-mono text-xs leading-relaxed"
                  placeholder={SKILL_CONTENT_TEMPLATE('my-skill', 'What this skill does…')}
                />
              </div>
            )}
          </div>

          {err && <p className="text-sm text-destructive">{err}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={saving}>
            {saving ? <Loader2 className="mr-1 size-4 animate-spin" /> : null}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditDialog({
  target,
  onClose,
  onSaved,
}: {
  target: { dirName: string; content: string } | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    setContent(target?.content ?? '');
    setErr('');
  }, [target]);

  if (!target) return null;

  const handleSave = async () => {
    setSaving(true);
    setErr('');
    try {
      await authFetch(`/api/v1/skills/${target.dirName}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={target !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="!w-[60vw] !max-w-none">
        <DialogHeader>
          <DialogTitle>Edit {target.dirName}/SKILL.md</DialogTitle>
          <DialogDescription>
            Frontmatter must remain valid (name, description). For more complex edits, use the
            workspace file editor.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[60vh] font-mono text-sm"
        />
        {err && <p className="text-sm text-destructive">{err}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={() => void handleSave()} disabled={saving}>
            {saving ? <Loader2 className="mr-1 size-4 animate-spin" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RenameDialog({
  target,
  onClose,
  onRenamed,
}: {
  target: { dirName: string } | null;
  onClose: () => void;
  onRenamed: () => void;
}) {
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    setNewName(target?.dirName ?? '');
    setErr('');
  }, [target]);

  if (!target) return null;

  const handleSubmit = async () => {
    setErr('');
    if (!NAME_REGEX.test(newName)) {
      setErr('Name must be lowercase alphanumeric with hyphens.');
      return;
    }
    setSaving(true);
    try {
      await authFetch(`/api/v1/skills/${target.dirName}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName }),
      });
      onRenamed();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to rename');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={target !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename skill</DialogTitle>
          <DialogDescription>
            The directory and the <code>name:</code> frontmatter field will both be updated.
          </DialogDescription>
        </DialogHeader>
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
        {err && <p className="text-sm text-destructive">{err}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={saving}>
            {saving ? <Loader2 className="mr-1 size-4 animate-spin" /> : null}
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteDialog({
  target,
  onClose,
  onDeleted,
}: {
  target: { dirName: string; name: string } | null;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  if (!target) return null;

  const handleConfirm = async () => {
    setSaving(true);
    setErr('');
    try {
      await authFetch(`/api/v1/skills/${target.dirName}`, { method: 'DELETE' });
      onDeleted();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={target !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete skill</DialogTitle>
          <DialogDescription>
            Permanently deletes <strong>{target.name}</strong> and all its files. This cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => void handleConfirm()} disabled={saving}>
            {saving ? <Loader2 className="mr-1 size-4 animate-spin" /> : null}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
