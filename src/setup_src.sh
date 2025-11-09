#!/bin/bash

if [[ "$(basename "$PWD")" != "src" ]]; then
    echo "⚠️ ERROR: This script must be run from inside the 'src/' directory."
    exit 1
fi

echo "Setting up Feature-Based structure inside 'src/'..."

# 1. إنشاء المجلدات الرئيسية
echo "Creating core directories..."
mkdir -p app assets components features hooks styles types utils

# 2. إنشاء مجلدات المكونات المشتركة
echo "Creating shared component subdirectories..."
mkdir -p components/{layout,ui,devExtremeWrappers,charts}

# 3. إنشاء مجلدات الميزات (Features) مع البنية الداخلية
echo "Creating feature subdirectories..."
FEATURES=(auth projects tasks comments files activity)
for feature in "${FEATURES[@]}"; do
    mkdir -p features/$feature/{api,components,pages}
done

# 4. إنشاء مجلدات الـ Styles (Sass)
echo "Creating Sass subdirectories..."
mkdir -p styles/{abstracts,base,components}

# 5. إنشاء الملفات الأساسية (Files)
echo "Creating initial files..."

# ملفات src/ الرئيسية
touch App.tsx main.tsx routes.tsx

# ملفات Redux
touch app/{store.ts,hooks.ts}

# ملفات Utils
touch utils/{api.ts,helpers.ts,constants.ts}

# ملفات Types
touch types/{index.d.ts,user.types.ts,project.types.ts,task.types.ts}

# ملفات Sass
touch styles/abstracts/{_variables.scss,_mixins.scss,_functions.scss}
touch styles/base/{_reset.scss,_typography.scss}
touch styles/main.scss

# ملفات Slices كمثال
touch features/projects/projectsSlice.ts
touch features/tasks/tasksSlice.ts

echo "-------------------------------------"
echo "✅ Structure setup complete inside src/!"
echo "-------------------------------------"