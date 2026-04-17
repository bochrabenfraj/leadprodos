#!/bin/bash

# AI Service Setup Script for Linux/Mac
# Creates virtual environment and installs dependencies

echo "🚀 AI Service Setup (Linux/Mac)"
echo "================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | awk '{print $2}')
echo "✅ Python version: $PYTHON_VERSION"

# Create virtual environment
echo ""
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip, setuptools, wheel
echo ""
echo "⚙️  Upgrading pip, setuptools, wheel..."
pip install --upgrade pip setuptools wheel

# Install requirements
echo ""
echo "📚 Installing dependencies from requirements.txt..."
pip install -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the service, run:"
echo "  source venv/bin/activate"
echo "  python app.py"
echo ""
echo "To run tests, run in a separate terminal:"
echo "  source venv/bin/activate"
echo "  python test_service.py"
