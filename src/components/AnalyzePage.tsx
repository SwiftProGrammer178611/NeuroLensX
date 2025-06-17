import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Upload,
  Search,
  ChevronDown,
  ChevronUp,
  LineChart,
  Network,
  BarChart3,
  BrainCircuit,
  Lightbulb,
  ZoomIn,
  ZoomOut,
  Move,
  Info,
  Table,
  Filter,
  ArrowUpDown,
  Eye,
} from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import * as d3 from 'd3';

// Define the base URL for your FastAPI backend
const API_BASE_URL = 'https://googlehackathonproj-gpm3zc4k7-moinsh2008-9140s-projects.vercel.app/'; // Assuming your FastAPI runs on port 8000


const preloadedModels = {
  'bert-base-uncased': 'BERT Base Uncased',
  'roberta-base': 'RoBERTa Base',
  'distilbert-base-uncased': 'DistilBERT Base Uncased',
};

const AnalyzePage = () => {
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState('bert-base-uncased');
  const [query, setQuery] = useState('She is a doctor.');
  const [conceptLibrary, setConceptLibrary] = useState('');
  const [availableConcepts, setAvailableConcepts] = useState<string[]>([]); // Concepts loaded from the backend
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]); // Concepts selected for CAVs
  const [extraConcepts, setExtraConcepts] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [maxNodes, setMaxNodes] = useState(200);
  const [nodeSamplingStrategy, setNodeSamplingStrategy] =
    useState('Top by Activation');
  const [selectedBiases, setSelectedBiases] = useState<string[]>([]);
  const [ragInput, setRagInput] = useState('');
  useEffect(() => {
    if (analysisResults) {
      const summary = JSON.stringify({
        cluster_labels: analysisResults.cluster_labels,
        cluster_sentences: analysisResults.cluster_sentences,
        top_neurons: analysisResults.top_neurons,
      }, null, 2);
      setRagInput(summary);
    }
  }, [analysisResults]);
  
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    modelSelection: true,
    conceptVectors: true,
    graphSettings: true,
    biasAnalysis: true,
    rag: true,
    results: true,
    recommendations: true,
    neuronGraph: true,
    neuronTable: true,
  });

  // State for analysis results
  
  const [ragResult, setRagResult] = useState<any>(null);
  const [biasAnalysisResult, setBiasAnalysisResult] = useState<any>(null);
  const [biasScoringResult, setBiasScoringResult] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedNeuron, setSelectedNeuron] = useState<any>(null);
  const [tableFilter, setTableFilter] = useState('');
  const [tableSortField, setTableSortField] = useState('activation_score');
  const [tableSortDirection, setTableSortDirection] = useState('desc');
  const [tablePageSize, setTablePageSize] = useState(20);
  const [tableCurrentPage, setTableCurrentPage] = useState(0);
  const handleNodeClick = (node: any) => {
    console.log("Selected node:", node); // Debug log
    setSelectedNeuron(node);
  };
  // Refs for interactive components
  const graphRef = useRef<any>(null);

  useEffect(() => {
    // Load concept library and available models on component mount
    fetchConceptLibrary();
  }, []);

  useEffect(() => {
    // Update available concepts for selection whenever conceptLibrary or extraConcepts change
    const conceptsFromLibrary = conceptLibrary
      .split('\n')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    const conceptsFromExtra = extraConcepts
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    setAvailableConcepts([
      ...new Set([...conceptsFromLibrary, ...conceptsFromExtra]),
    ]);
  }, [conceptLibrary, extraConcepts]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleModelSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  const handleConceptSelect = (concept: string) => {
    setSelectedConcepts((prev) =>
      prev.includes(concept)
        ? prev.filter((c) => c !== concept)
        : [...prev, concept]
    );
  };

  // API Call: Fetch Concept Library
  const fetchConceptLibrary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/concept-library`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setConceptLibrary(data.concepts.join('\n'));
      setSelectedConcepts(data.concepts); // Automatically select loaded concepts
    } catch (error) {
      console.error('Error fetching concept library:', error);
      // Optionally display an error message to the user
    }
  };

  // API Call: Save Concept Library
  const saveConceptLibrary = async () => {
    try {
      const conceptsArray = conceptLibrary
        .split('\n')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
      const response = await fetch(`${API_BASE_URL}/concept-library`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ concepts: conceptsArray }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // const data = await response.json();
      alert('Concept library saved!');
    } catch (error) {
      console.error('Error saving concept library:', error);
      alert('Failed to save concept library.');
    }
  };

  // API Call: Analyze Model
  const handleAnalyze = async () => {
    setIsProcessing(true);
    setAnalysisResults(null); // Clear previous results
    setBiasAnalysisResult(null); // Clear previous bias results
    setBiasScoringResult(null); // Clear previous bias scoring results
    setSelectedNeuron(null); // Clear selected neuron

    try {
      const response = await fetch(`${API_BASE_URL}/analyze-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          selected_cavs: selectedConcepts, // Use selected concepts for CAVs
          max_nodes_graph: maxNodes,
          graph_strategy: nodeSamplingStrategy,
          model_name: selectedModel, // ✅ ADD THIS LINE
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Analysis results:", data); // Debug log
      setAnalysisResults(data);

      // Automatically run bias analysis if two biases are selected
      if (selectedBiases.length === 2) {
        await runBiasAnalysis();
      }

      // Automatically run bias scoring if concepts are selected
      if (selectedConcepts.length > 0) {
        await runBiasScoring();
      }

      await fetchRecommendations(query); // Fetch new recommendations after analysis
    } catch (error: any) {
      console.error('Error during analysis:', error.message);
      alert(`Analysis failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  const [gitlabRepo, setGitlabRepo] = useState('');

  const triggerGitlabUpdate = async () => {
    if (!gitlabRepo) {
      alert('Please provide a GitLab repo URL.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/trigger-gitlab-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: gitlabRepo }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || `HTTP error! status: ${response.status}`);
      }
      alert('GitLab update triggered!');
    } catch (error: any) {
      alert(`Failed to trigger update: ${error.message}`);
    }
  };
  
  // API Call: RAG Generate
  const handleRagGenerate = async () => {
    if (!analysisResults) {
      alert("Please analyze the model first.");
      return;
    }
    if (!ragInput || !query) {
      alert('Please provide both RAG Input and a Query.');
      return;
    }
    setIsProcessing(true);
    setRagResult(null); // Clear previous RAG result

    try {
      const response = await fetch(`${API_BASE_URL}/rag-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          rag_input: ragInput,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setRagResult(data);
    } catch (error: any) {
      console.error('Error during RAG generation:', error.message);
      alert(`RAG generation failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // API Call: Bias Analysis
  const runBiasAnalysis = async () => {
    if (selectedBiases.length !== 2) {
      alert('Please select exactly two bias concepts for comparison.');
      return;
    }
    setIsProcessing(true);
    setBiasAnalysisResult(null); // Clear previous bias analysis result

    try {
      const response = await fetch(`${API_BASE_URL}/bias-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          selected_cavs: selectedConcepts, // All selected concepts are sent for CAVs
          selected_biases: selectedBiases, // The two specific biases to compare
          num_clusters: 5,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Bias analysis results:", data); // Debug log
      setBiasAnalysisResult(data);
    } catch (error: any) {
      console.error('Error during bias analysis:', error.message);
      alert(`Bias analysis failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // API Call: Bias Scoring
  const runBiasScoring = async () => {
    if (selectedConcepts.length === 0) {
      alert('Please select concepts for bias scoring.');
      return;
    }
    setIsProcessing(true);
    setBiasScoringResult(null); // Clear previous bias scoring result

    try {
      const response = await fetch(`${API_BASE_URL}/bias-scoring`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selected_cavs: selectedConcepts,
          num_samples: 100, // Hardcoded for now, can be made dynamic
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Bias scoring results:", data); // Debug log
      setBiasScoringResult(data);
    } catch (error: any) {
      console.error('Error during bias scoring:', error.message);
      alert(`Bias scoring failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // API Call: Fetch Recommendations
  const fetchRecommendations = async (query: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/recommendations/${encodeURIComponent(query)}`);
      const data = await res.json();
  
      const aiRecs = data.recommendations.map((line: any) => {
        if (typeof line === 'string') {
          return {
            title: line,
            description: '',
            icon: 'Lightbulb',
            priority: 'Medium',
            details: [],
          };
        } else if (typeof line === 'object' && line.title) {
          return {
            ...line,
            title: String(line.title), // Force string
            description: String(line.description || ''),
          };
        } else {
          return {
            title: 'Unknown Recommendation',
            description: '',
            icon: 'Lightbulb',
            priority: 'Medium',
            details: [],
          };
        }
      });
      
  
      setRecommendations(aiRecs);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    }
  };
  
  
  // Handle neuron table filtering and sorting
  const getFilteredAndSortedNeurons = () => {
    if (!analysisResults?.activation_table) return [];

    let filtered = analysisResults.activation_table;

    // Apply filter
    if (tableFilter) {
      const filterLower = tableFilter.toLowerCase();
      filtered = filtered.filter((neuron: any) => 
        (neuron.token && neuron.token.toLowerCase().includes(filterLower)) ||
        (neuron.layer && neuron.layer.toString().includes(filterLower)) ||
        (neuron.cluster_id && neuron.cluster_id.toString().includes(filterLower))
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a: any, b: any) => {
      if (!a || !b) return 0;
      
      const aValue = a[tableSortField];
      const bValue = b[tableSortField];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return tableSortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // String comparison
      const aStr = String(aValue || '');
      const bStr = String(bValue || '');
      return tableSortDirection === 'asc' 
        ? aStr.localeCompare(bStr) 
        : bStr.localeCompare(aStr);
    });

    return filtered;
  };

  // Handle table pagination
  const getPaginatedNeurons = () => {
    const filtered = getFilteredAndSortedNeurons();
    const startIdx = tableCurrentPage * tablePageSize;
    return filtered.slice(startIdx, startIdx + tablePageSize);
  };

  // Toggle sort direction or change sort field
  const handleTableSort = (field: string) => {
    if (field === tableSortField) {
      setTableSortDirection(tableSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setTableSortField(field);
      setTableSortDirection('desc'); // Default to descending for new field
    }
  };

  // Get total pages for pagination
  const getTotalPages = () => {
    const filtered = getFilteredAndSortedNeurons();
    return Math.ceil(filtered.length / tablePageSize);
  };

  // Safely check if a property exists and has data
  const hasData = (obj: any, path: string) => {
    if (!obj) return false;
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current[part] === undefined || current[part] === null) {
        return false;
      }
      current = current[part];
    }
    return true;
  };

  // Safely get a nested property
  const safeGet = (obj: any, path: string, defaultValue: any = null) => {
    if (!obj) return defaultValue;
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current[part] === undefined || current[part] === null) {
        return defaultValue;
      }
      current = current[part];
    }
    return current;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B1A] to-[#150F2E] text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Brain className="h-8 w-8 text-[#4DE8ED]" />
          <h1 className="text-3xl font-bold">Neural Network Analysis</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Model Selection */}
            <div className="bg-[#0D0E23]/60 rounded-xl p-6 border border-[#1E184A]">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('modelSelection')}
              >
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Upload className="h-5 w-5 text-[#4DE8ED]" />
                  Model Selection
                </h2>
                {expandedSections.modelSelection ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </div>

              {expandedSections.modelSelection && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Model
                    </label>
                    <select
                      value={selectedModel}
                      onChange={handleModelSelect}
                      className="w-full bg-[#0B0B1A] border border-[#1E184A] rounded-lg px-4 py-2 focus:outline-none focus:border-[#4DE8ED]"
                    >
                      {Object.entries(preloadedModels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                      <option value="upload">Upload Custom Model</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Input Query
                    </label>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-[#0B0B1A] border border-[#1E184A] rounded-lg px-4 py-2 focus:outline-none focus:border-[#4DE8ED]"
                      placeholder="Enter your query..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Graph Settings */}
            <div className="bg-[#0D0E23]/60 rounded-xl p-6 border border-[#1E184A]">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('graphSettings')}
              >
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Network className="h-5 w-5 text-[#6C5CE7]" />
                  Graph Settings
                </h2>
                {expandedSections.graphSettings ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </div>

              {expandedSections.graphSettings && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Node Sampling Strategy
                    </label>
                    <select
                      value={nodeSamplingStrategy}
                      onChange={(e) => setNodeSamplingStrategy(e.target.value)}
                      className="w-full bg-[#0B0B1A] border border-[#1E184A] rounded-lg px-4 py-2 focus:outline-none focus:border-[#4DE8ED]"
                    >
                      <option value="Top by Activation">
                        Top by Activation
                      </option>
                      <option value="Random">Random</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Max Neurons in Graph: {maxNodes}
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="2000"
                      step="50"
                      value={maxNodes}
                      onChange={(e) => setMaxNodes(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Concept Vectors */}
            <div className="bg-[#0D0E23]/60 rounded-xl p-6 border border-[#1E184A]">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('conceptVectors')}
              >
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Search className="h-5 w-5 text-[#C14BEA]" />
                  Concept Activation Vectors
                </h2>
                {expandedSections.conceptVectors ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </div>

              {expandedSections.conceptVectors && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Concept Library (one per line)
                    </label>
                    <textarea
                      value={conceptLibrary}
                      onChange={(e) => setConceptLibrary(e.target.value)}
                      className="w-full bg-[#0B0B1A] border border-[#1E184A] rounded-lg px-4 py-2 focus:outline-none focus:border-[#4DE8ED] h-32"
                      placeholder="Enter concepts, one per line..."
                    />
                    <div className="flex justify-between mt-2">
                      <button
                        onClick={fetchConceptLibrary}
                        className="px-4 py-1 bg-[#1E184A] rounded-lg hover:bg-[#2A2363] transition-colors"
                      >
                        Load Library
                      </button>
                      <button
                        onClick={saveConceptLibrary}
                        className="px-4 py-1 bg-[#1E184A] rounded-lg hover:bg-[#2A2363] transition-colors"
                      >
                        Save to Library
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Available Concepts for CAVs
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableConcepts.map((concept) => (
                        <button
                          key={concept}
                          onClick={() => handleConceptSelect(concept)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            selectedConcepts.includes(concept)
                              ? 'bg-[#C14BEA] text-white'
                              : 'bg-[#1E184A] text-gray-300 hover:bg-[#2A2363]'
                          } transition-colors`}
                        >
                          {concept}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Extra Concepts (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={extraConcepts}
                      onChange={(e) => setExtraConcepts(e.target.value)}
                      className="w-full bg-[#0B0B1A] border border-[#1E184A] rounded-lg px-4 py-2 focus:outline-none focus:border-[#4DE8ED]"
                      placeholder="Add extra concepts (comma-separated)..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Bias Analysis */}
            <div className="bg-[#0D0E23]/60 rounded-xl p-6 border border-[#1E184A]">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('biasAnalysis')}
              >
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#FD79A8]" />
                  Bias Analysis
                </h2>
                {expandedSections.biasAnalysis ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </div>

              {expandedSections.biasAnalysis && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Bias Concepts to Compare
                    </label>
                    <select
                      multiple
                      value={selectedBiases}
                      onChange={(e) =>
                        setSelectedBiases(
                          Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          )
                        )
                      }
                      className="w-full bg-[#0B0B1A] border border-[#1E184A] rounded-lg px-4 py-2 focus:outline-none focus:border-[#4DE8ED] h-32"
                    >
                      {selectedConcepts.map((concept) => (
                        <option key={concept} value={concept}>
                          {concept}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-400 mt-1">
                      Select exactly two concepts to compare for detailed bias
                      analysis.
                    </p>
                  </div>
                  <button
                    onClick={runBiasAnalysis}
                    disabled={isProcessing || selectedBiases.length !== 2}
                    className={`w-full py-2 rounded-lg font-semibold transition-opacity ${
                      isProcessing || selectedBiases.length !== 2
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#FD79A8] to-[#C14BEA] hover:opacity-90'
                    }`}
                  >
                    {isProcessing
                      ? 'Analyzing Bias...'
                      : 'Run Detailed Bias Analysis'}
                  </button>
                  <button
                    onClick={runBiasScoring}
                    disabled={isProcessing || selectedConcepts.length === 0}
                    className={`w-full py-2 rounded-lg font-semibold transition-opacity mt-2 ${
                      isProcessing || selectedConcepts.length === 0
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#4DE8ED] to-[#6C5CE7] hover:opacity-90'
                    }`}
                  >
                    {isProcessing ? 'Scoring Biases...' : 'Run Bias Scoring'}
                  </button>
                </div>
              )}
            </div>

            {/* RAG Interface */}
            <div className="bg-[#0D0E23]/60 rounded-xl p-6 border border-[#1E184A]">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('rag')}
              >
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-[#4DE8ED]" />
                  RAG Interface
                </h2>
                {expandedSections.rag ? <ChevronUp /> : <ChevronDown />}
              </div>

              {expandedSections.rag && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      RAG Input (Context)
                    </label>
                    <label className="block text-sm font-medium mb-2 mt-4">
                      GitLab Repo URL
                    </label>
                    <input
                      type="text"
                      value={gitlabRepo}
                      onChange={(e) => setGitlabRepo(e.target.value)}
                      className="w-full bg-[#0B0B1A] border border-[#1E184A] rounded-lg px-4 py-2 focus:outline-none focus:border-[#4DE8ED]"
                      placeholder="https://gitlab.com/username/repo"
                    />
                    <button
                      onClick={triggerGitlabUpdate}
                      disabled={!gitlabRepo}
                      className="mt-2 w-full py-2 rounded-lg font-semibold transition-opacity bg-gradient-to-r from-[#FD79A8] to-[#C14BEA] hover:opacity-90"
                    >
                      Trigger Model Update
                    </button>

                    <textarea
                      value={ragInput}
                      onChange={(e) => setRagInput(e.target.value)}
                      className="w-full bg-[#0B0B1A] border border-[#1E184A] rounded-lg px-4 py-2 focus:outline-none focus:border-[#4DE8ED] h-32"
                      placeholder="Edit or enter your custom input for RAG generation..."
                    />
                  </div>

                  <button
                    onClick={handleRagGenerate}
                    disabled={!analysisResults || isProcessing || !ragInput}
                    className={`w-full py-2 rounded-lg font-semibold transition-opacity ${
                      isProcessing || !ragInput || !query
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#4DE8ED] to-[#6C5CE7] hover:opacity-90'
                    }`}
                  >
                    {isProcessing ? 'Generating...' : 'Generate RAG Answer'}
                  </button>

                  {ragResult && (
                    <div className="mt-4 p-4 bg-[#0B0B1A] rounded-lg border border-[#1E184A]">
                      <h3 className="text-lg font-medium mb-2">
                        RAG Generated Answer:
                      </h3>
                      <p className="text-gray-300">
                        {ragResult.generated_text}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isProcessing}
          className={`w-full py-3 rounded-lg text-center font-semibold my-8 transition-all ${
            isProcessing
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#4DE8ED] to-[#C14BEA] hover:opacity-90'
          }`}
        >
          {isProcessing ? 'Processing Analysis...' : 'Analyze Model'}
        </button>

        {/* Results Section */}
        <div className="bg-[#0D0E23]/60 rounded-xl p-6 border border-[#1E184A] mt-6">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('results')}
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <LineChart className="h-5 w-5 text-[#4DE8ED]" />
              Analysis Results
            </h2>
            {expandedSections.results ? <ChevronUp /> : <ChevronDown />}
          </div>

          {expandedSections.results && (
            <div className="mt-4 space-y-8">
              {!analysisResults &&
                !biasAnalysisResult &&
                !biasScoringResult && (
                  <p className="text-gray-400 text-center">
                    Run an analysis to see results here.
                  </p>
                )}

              {analysisResults && (
                <>
                  {/* Query Information */}
                  <div className="bg-[#0B0B1A] rounded-lg p-4 border border-[#1E184A]">
                    <h3 className="text-lg font-medium mb-3">
                      Query Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400">Query:</p>
                        <p className="text-white font-medium">{safeGet(analysisResults, 'query', '')}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Tokens:</p>
                        <p className="text-white font-medium">
                          {safeGet(analysisResults, 'tokens', []).join(', ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Number of Layers:</p>
                        <p className="text-white font-medium">{safeGet(analysisResults, 'num_layers', 0)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Number of Tokens:</p>
                        <p className="text-white font-medium">{safeGet(analysisResults, 'num_tokens', 0)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Highest Bias Layer:</p>
                        <p className="text-white font-medium">{safeGet(analysisResults, 'highest_bias_layer', 'N/A')}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Highest Bias Score:</p>
                        <p className="text-white font-medium">
                          {typeof safeGet(analysisResults, 'highest_bias_score', null) === 'number' 
                            ? safeGet(analysisResults, 'highest_bias_score').toFixed(4) 
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Neuron Graph */}
                  <div className="bg-[#0B0B1A] rounded-lg p-4 border border-[#1E184A]">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleSection('neuronGraph')}
                    >
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Network className="h-5 w-5 text-[#4DE8ED]" />
                        Interactive Neuron Graph
                      </h3>
                      {expandedSections.neuronGraph ? <ChevronUp /> : <ChevronDown />}
                    </div>

                    {expandedSections.neuronGraph && (
                      <div className="mt-4">
                        {hasData(analysisResults, 'interactive_graph') && 
                         hasData(analysisResults, 'interactive_graph.nodes') && 
                         analysisResults.interactive_graph.nodes.length > 0 ? (
                          <div className="relative">
                            <div className="absolute top-2 right-2 z-10 flex gap-2">
                              <button 
                                className="p-2 bg-[#1E184A] rounded-full hover:bg-[#2A2363] transition-colors"
                                onClick={() => graphRef.current?.zoomIn()}
                              >
                                <ZoomIn className="h-4 w-4" />
                              </button>
                              <button 
                                className="p-2 bg-[#1E184A] rounded-full hover:bg-[#2A2363] transition-colors"
                                onClick={() => graphRef.current?.zoomOut()}
                              >
                                <ZoomOut className="h-4 w-4" />
                              </button>
                              <button 
                                className="p-2 bg-[#1E184A] rounded-full hover:bg-[#2A2363] transition-colors"
                                onClick={() => graphRef.current?.centerAt()}
                              >
                                <Move className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="h-[600px] max-w-full overflow-hidden bg-[#0D0E23] rounded-lg">
                              <ForceGraph2D
                                width={window.innerWidth * 0.9}  // optional: dynamically constrain width
                                height={600}
                                ref={graphRef}
                                graphData={analysisResults.interactive_graph}
                                nodeLabel={(node: any) => `${node.label || node.token || 'Node'} (Activation: ${(node.activation || 0).toFixed(4)})`}
                                nodeColor={(node: any) => d3.schemeCategory10[node.cluster % 10 || 0]}
                                nodeRelSize={6}
                                linkWidth={(link: any) => (link.weight || 1) * 2}
                                linkColor={() => "#ffffff33"}
                                cooldownTicks={100}
                                onNodeClick={handleNodeClick}
                                nodeCanvasObjectMode={() => "after"}
                                nodeCanvasObject={(node: any, ctx, globalScale) => {
                                  // Add text labels for nodes
                                  const label = node.token || node.label || '';
                                  const fontSize = 12/globalScale;
                                  ctx.font = `${fontSize}px Sans-Serif`;
                                  ctx.textAlign = 'center';
                                  ctx.textBaseline = 'middle';
                                  ctx.fillStyle = 'white';
                                  
                                  // Draw text background for better readability
                                  const textWidth = ctx.measureText(label).width;
                                  const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);
                                  
                                  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                                  ctx.fillRect(
                                    node.x - bckgDimensions[0] / 2,
                                    node.y - bckgDimensions[1] / 2,
                                    bckgDimensions[0],
                                    bckgDimensions[1]
                                  );
                                  
                                  // Draw text
                                  ctx.fillStyle = 'white';
                                  ctx.fillText(label, node.x, node.y);
                                  
                                  // Highlight selected node
                                  if (selectedNeuron && node.id === selectedNeuron.id) {
                                    ctx.strokeStyle = '#ff0';
                                    ctx.lineWidth = 2 / globalScale;
                                    ctx.beginPath();
                                    ctx.arc(node.x, node.y, (node.val || 3) * 1.4, 0, 2 * Math.PI);
                                    ctx.stroke();
                                  }
                                }}
                              />
                            </div>
                            
                            {selectedNeuron && (
                              <div className="mt-4 p-4 bg-[#0D0E23] rounded-lg border border-[#1E184A]">
                                <h4 className="text-md font-medium mb-2 flex items-center gap-2">
                                  <Info className="h-4 w-4 text-[#4DE8ED]" />
                                  Selected Neuron Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-gray-400">Token:</p>
                                    <p className="text-white font-medium">{selectedNeuron.token || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400">Layer:</p>
                                    <p className="text-white font-medium">{selectedNeuron.layer || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400">Cluster:</p>
                                    <p className="text-white font-medium">{selectedNeuron.cluster || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400">Activation:</p>
                                    <p className="text-white font-medium">
                                      {typeof selectedNeuron.activation === 'number' 
                                        ? selectedNeuron.activation.toFixed(4) 
                                        : 'N/A'}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <p className="text-gray-400">Cluster Label:</p>
                                  <p className="text-white font-medium">
                                    {safeGet(analysisResults, `cluster_labels.${selectedNeuron.cluster}`, "No label available")}
                                  </p>
                                </div>
                                <div className="mt-3">
                                  <p className="text-gray-400">Cluster Description:</p>
                                  <p className="text-white font-medium">
                                    {safeGet(analysisResults, `cluster_sentences.${selectedNeuron.cluster}`, "No description available")}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-[400px] bg-[#0D0E23] rounded-lg flex items-center justify-center text-gray-500">
                            No Interactive Graph Data Available
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Neuron Activation Table */}
                  <div className="bg-[#0B0B1A] rounded-lg p-4 border border-[#1E184A]">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleSection('neuronTable')}
                    >
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Table className="h-5 w-5 text-[#4DE8ED]" />
                        Neuron Activation Table
                      </h3>
                      {expandedSections.neuronTable ? <ChevronUp /> : <ChevronDown />}
                    </div>

                    {expandedSections.neuronTable && (
                      <div className="mt-4">
                        {hasData(analysisResults, 'activation_table') && analysisResults.activation_table.length > 0 ? (
                          <div>
                            <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
                              <div className="relative flex-grow">
                                <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                  type="text"
                                  value={tableFilter}
                                  onChange={(e) => setTableFilter(e.target.value)}
                                  placeholder="Filter neurons..."
                                  className="w-full bg-[#0D0E23] border border-[#1E184A] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#4DE8ED]"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">Rows:</span>
                                <select
                                  value={tablePageSize}
                                  onChange={(e) => {
                                    setTablePageSize(Number(e.target.value));
                                    setTableCurrentPage(0); // Reset to first page
                                  }}
                                  className="bg-[#0D0E23] border border-[#1E184A] rounded-lg px-2 py-1 focus:outline-none focus:border-[#4DE8ED]"
                                >
                                  <option value="10">10</option>
                                  <option value="20">20</option>
                                  <option value="50">50</option>
                                  <option value="100">100</option>
                                </select>
                              </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-sm text-left text-gray-400">
                                <thead className="text-xs uppercase bg-[#1E184A] text-gray-200">
                                  <tr>
                                    <th 
                                      scope="col" 
                                      className="px-4 py-2 cursor-pointer hover:bg-[#2A2363]"
                                      onClick={() => handleTableSort('layer')}
                                    >
                                      <div className="flex items-center gap-1">
                                        Layer
                                        {tableSortField === 'layer' && (
                                          <ArrowUpDown className="h-3 w-3" />
                                        )}
                                      </div>
                                    </th>
                                    <th 
                                      scope="col" 
                                      className="px-4 py-2 cursor-pointer hover:bg-[#2A2363]"
                                      onClick={() => handleTableSort('token_idx')}
                                    >
                                      <div className="flex items-center gap-1">
                                        Token Index
                                        {tableSortField === 'token_idx' && (
                                          <ArrowUpDown className="h-3 w-3" />
                                        )}
                                      </div>
                                    </th>
                                    <th 
                                      scope="col" 
                                      className="px-4 py-2 cursor-pointer hover:bg-[#2A2363]"
                                      onClick={() => handleTableSort('token')}
                                    >
                                      <div className="flex items-center gap-1">
                                        Token
                                        {tableSortField === 'token' && (
                                          <ArrowUpDown className="h-3 w-3" />
                                        )}
                                      </div>
                                    </th>
                                    <th 
                                      scope="col" 
                                      className="px-4 py-2 cursor-pointer hover:bg-[#2A2363]"
                                      onClick={() => handleTableSort('activation_score')}
                                    >
                                      <div className="flex items-center gap-1">
                                        Activation Score
                                        {tableSortField === 'activation_score' && (
                                          <ArrowUpDown className="h-3 w-3" />
                                        )}
                                      </div>
                                    </th>
                                    <th 
                                      scope="col" 
                                      className="px-4 py-2 cursor-pointer hover:bg-[#2A2363]"
                                      onClick={() => handleTableSort('cluster_id')}
                                    >
                                      <div className="flex items-center gap-1">
                                        Cluster
                                        {tableSortField === 'cluster_id' && (
                                          <ArrowUpDown className="h-3 w-3" />
                                        )}
                                      </div>
                                    </th>
                                    <th scope="col" className="px-4 py-2">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {getPaginatedNeurons().map((neuron: any, index: number) => (
                                    <tr
                                      key={index}
                                      className={`bg-[#0B0B1A] border-b border-[#1E184A] ${
                                        selectedNeuron && 
                                        selectedNeuron.layer === neuron.layer && 
                                        selectedNeuron.token === neuron.token
                                          ? 'bg-[#1E184A]/50'
                                          : ''
                                      }`}
                                    >
                                      <td className="px-4 py-2">{neuron.layer}</td>
                                      <td className="px-4 py-2">{neuron.token_idx}</td>
                                      <td className="px-4 py-2">{neuron.token}</td>
                                      <td className="px-4 py-2">
                                        {typeof neuron.activation_score === 'number' 
                                          ? neuron.activation_score.toFixed(4) 
                                          : 'N/A'}
                                      </td>
                                      <td className="px-4 py-2">
                                        <span 
                                          className="inline-block px-2 py-1 rounded-full text-xs"
                                          style={{ 
                                            backgroundColor: d3.schemeCategory10[neuron.cluster_id % 10] + '33',
                                            color: d3.schemeCategory10[neuron.cluster_id % 10]
                                          }}
                                        >
                                          {neuron.cluster_id}
                                        </span>
                                      </td>
                                      <td className="px-4 py-2">
                                        <button
                                          onClick={() => {
                                            // Find corresponding node in graph
                                            if (hasData(analysisResults, 'interactive_graph.nodes')) {
                                              const node = analysisResults.interactive_graph.nodes.find(
                                                (n: any) => 
                                                  n.layer === neuron.layer && 
                                                  n.token === neuron.token
                                              );
                                              if (node) {
                                                setSelectedNeuron(node);
                                                // Ensure graph section is expanded
                                                if (!expandedSections.neuronGraph) {
                                                  toggleSection('neuronGraph');
                                                }
                                                // Center graph on this node
                                                if (graphRef.current) {
                                                  graphRef.current.centerAt(node.x, node.y, 1000);
                                                  graphRef.current.zoom(2, 1000);
                                                }
                                              }
                                            }
                                          }}
                                          className="p-1 bg-[#1E184A] rounded hover:bg-[#2A2363] transition-colors"
                                          title="View in graph"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            
                            {/* Pagination */}
                            <div className="flex justify-between items-center mt-4">
                              <div className="text-sm text-gray-400">
                                Showing {tableCurrentPage * tablePageSize + 1} to {
                                  Math.min((tableCurrentPage + 1) * tablePageSize, getFilteredAndSortedNeurons().length)
                                } of {getFilteredAndSortedNeurons().length} neurons
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setTableCurrentPage(Math.max(0, tableCurrentPage - 1))}
                                  disabled={tableCurrentPage === 0}
                                  className={`px-3 py-1 rounded ${
                                    tableCurrentPage === 0
                                      ? 'bg-gray-700 cursor-not-allowed'
                                      : 'bg-[#1E184A] hover:bg-[#2A2363]'
                                  }`}
                                >
                                  Previous
                                </button>
                                <button
                                  onClick={() => setTableCurrentPage(Math.min(getTotalPages() - 1, tableCurrentPage + 1))}
                                  disabled={tableCurrentPage >= getTotalPages() - 1}
                                  className={`px-3 py-1 rounded ${
                                    tableCurrentPage >= getTotalPages() - 1
                                      ? 'bg-gray-700 cursor-not-allowed'
                                      : 'bg-[#1E184A] hover:bg-[#2A2363]'
                                  }`}
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-[200px] bg-[#0D0E23] rounded-lg flex items-center justify-center text-gray-500">
                            No Neuron Activation Data Available
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* PCA Plot and Cluster-CAV Mapping */}
                    <div className="bg-[#0B0B1A] rounded-lg p-4 border border-[#1E184A]">
                      <h3 className="text-lg font-medium mb-3">
                        PCA + KMeans Clusters
                      </h3>
                      {hasData(analysisResults, 'charts.pca_plot') ? (
                        <img
                          src={`data:image/png;base64,${analysisResults.charts.pca_plot}`}
                          alt="PCA Clusters"
                          className="w-full h-auto rounded-lg"
                        />
                      ) : (
                        <div className="aspect-square bg-[#0D0E23] rounded-lg flex items-center justify-center text-gray-500">
                          No PCA Plot
                        </div>
                      )}
                      
                      {/* Persistence Diagram */}
                      <h3 className="text-lg font-medium mt-4 mb-3">
                        Topological Persistence Diagram
                      </h3>
                      {hasData(analysisResults, 'charts.persistence_diagram') ? (
                        <img
                          src={`data:image/png;base64,${analysisResults.charts.persistence_diagram}`}
                          alt="Persistence Diagram"
                          className="w-full h-auto rounded-lg"
                        />
                      ) : (
                        <div className="aspect-square bg-[#0D0E23] rounded-lg flex items-center justify-center text-gray-500">
                          No Persistence Diagram
                        </div>
                      )}
                      
                      <h3 className="text-lg font-medium mt-4 mb-3">
                        Cluster-CAV Mapping:
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-400">
                          <thead className="text-xs uppercase bg-[#1E184A] text-gray-200">
                            <tr>
                              <th scope="col" className="px-4 py-2">
                                Cluster ID
                              </th>
                              <th scope="col" className="px-4 py-2">
                                Label
                              </th>
                              <th scope="col" className="px-4 py-2">
                                Related Concept (CAV)
                              </th>
                              <th scope="col" className="px-4 py-2">
                                Similarity
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {hasData(analysisResults, 'cluster_cav_table') && 
                             analysisResults.cluster_cav_table.map(
                              (row: any, index: number) => (
                                <tr
                                  key={index}
                                  className="bg-[#0B0B1A] border-b border-[#1E184A]"
                                >
                                  <td className="px-4 py-2">
                                    {row.cluster_id}
                                  </td>
                                  <td className="px-4 py-2">{row.label || 'N/A'}</td>
                                  <td className="px-4 py-2">
                                    {row.related_concept || 'N/A'}
                                  </td>
                                  <td className="px-4 py-2">
                                    {typeof row.similarity_score === 'number' 
                                      ? row.similarity_score.toFixed(4) 
                                      : 'N/A'}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Activation Visualizations */}
                    <div className="bg-[#0B0E1A] rounded-lg p-4 border border-[#1E184A]">
                      <h3 className="text-lg font-medium mb-3">
                        Neuron Activation Heatmap
                      </h3>
                      {hasData(analysisResults, 'charts.heatmap') ? (
                        <img
                          src={`data:image/png;base64,${analysisResults.charts.heatmap}`}
                          alt="Activation Heatmap"
                          className="w-full h-auto rounded-lg"
                        />
                      ) : (
                        <div className="aspect-square bg-[#0D0E23] rounded-lg flex items-center justify-center text-gray-500">
                          No Heatmap
                        </div>
                      )}

                      <h3 className="text-lg font-medium mt-4 mb-3">
                        Concept Activation Strengths Across Layers
                      </h3>
                      {hasData(analysisResults, 'charts.concept_chart') ? (
                        <img
                          src={`data:image/png;base64,${analysisResults.charts.concept_chart}`}
                          alt="Concept Activations"
                          className="w-full h-auto rounded-lg"
                        />
                      ) : (
                        <div className="aspect-video bg-[#0D0E23] rounded-lg flex items-center justify-center text-gray-500">
                          No Concept Activation Chart
                        </div>
                      )}

                      <h3 className="text-lg font-medium mt-4 mb-3">
                        Average Activation Score per Layer
                      </h3>
                      {hasData(analysisResults, 'charts.layer_chart') ? (
                        <img
                          src={`data:image/png;base64,${analysisResults.charts.layer_chart}`}
                          alt="Layer Activations"
                          className="w-full h-auto rounded-lg"
                        />
                      ) : (
                        <div className="aspect-video bg-[#0D0E23] rounded-lg flex items-center justify-center text-gray-500">
                          No Layer Activation Chart
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cluster Details */}
                  {hasData(analysisResults, 'cluster_labels') && Object.keys(analysisResults.cluster_labels).length > 0 && (
                    <div className="bg-[#0B0B1A] rounded-lg p-4 border border-[#1E184A]">
                      <h3 className="text-lg font-medium mb-3">
                        Cluster Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(analysisResults.cluster_labels).map(([clusterId, label]: [string, any]) => (
                          <div key={clusterId} className="bg-[#0D0E23] p-3 rounded-lg">
                            <h4 className="font-medium text-[#4DE8ED]">Cluster {clusterId}</h4>
                            <p className="text-white">{label}</p>
                            <p className="text-sm text-gray-400 mt-2">
                              {safeGet(analysisResults, `cluster_sentences.${clusterId}`, "No sentence data")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Neurons */}
                  {hasData(analysisResults, 'top_neurons') && analysisResults.top_neurons.length > 0 && (
                    <div className="bg-[#0B0B1A] rounded-lg p-4 border border-[#1E184A]">
                      <h3 className="text-lg font-medium mb-3">
                        Top Neurons by Activation
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-400">
                          <thead className="text-xs uppercase bg-[#1E184A] text-gray-200">
                            <tr>
                              <th scope="col" className="px-4 py-2">
                                Rank
                              </th>
                              <th scope="col" className="px-4 py-2">
                                Neuron Index
                              </th>
                              <th scope="col" className="px-4 py-2">
                                Layer
                              </th>
                              <th scope="col" className="px-4 py-2">
                                Token
                              </th>
                              <th scope="col" className="px-4 py-2">
                                Activation Score
                              </th>
                              <th scope="col" className="px-4 py-2">
                                Cluster ID
                              </th>
                              <th scope="col" className="px-4 py-2">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {analysisResults.top_neurons.map(
                              (neuron: any, index: number) => (
                                <tr
                                  key={index}
                                  className="bg-[#0B0B1A] border-b border-[#1E184A]"
                                >
                                  <td className="px-4 py-2">{neuron.rank || index+1}</td>
                                  <td className="px-4 py-2">{neuron.neuron_index || 'N/A'}</td>
                                  <td className="px-4 py-2">{neuron.layer || 'N/A'}</td>
                                  <td className="px-4 py-2">{neuron.token || 'N/A'}</td>
                                  <td className="px-4 py-2">
                                    {typeof neuron.activation_score === 'number' 
                                      ? neuron.activation_score.toFixed(4) 
                                      : 'N/A'}
                                  </td>
                                  <td className="px-4 py-2">
                                    <span 
                                      className="inline-block px-2 py-1 rounded-full text-xs"
                                      style={{ 
                                        backgroundColor: d3.schemeCategory10[(neuron.cluster_id || 0) % 10] + '33',
                                        color: d3.schemeCategory10[(neuron.cluster_id || 0) % 10]
                                      }}
                                    >
                                      {neuron.cluster_id || 'N/A'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2">
                                    <button
                                      onClick={() => {
                                        // Find corresponding node in graph
                                        if (hasData(analysisResults, 'interactive_graph.nodes')) {
                                          const node = analysisResults.interactive_graph.nodes.find(
                                            (n: any) => 
                                              n.layer === neuron.layer && 
                                              n.token === neuron.token
                                          );
                                          if (node) {
                                            setSelectedNeuron(node);
                                            // Ensure graph section is expanded
                                            if (!expandedSections.neuronGraph) {
                                              toggleSection('neuronGraph');
                                            }
                                            // Center graph on this node
                                            if (graphRef.current) {
                                              graphRef.current.centerAt(node.x, node.y, 1000);
                                              graphRef.current.zoom(2, 1000);
                                            }
                                          }
                                        }
                                      }}
                                      className="p-1 bg-[#1E184A] rounded hover:bg-[#2A2363] transition-colors"
                                      title="View in graph"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TDA Features */}
                  {hasData(analysisResults, 'tda_features') && Object.keys(analysisResults.tda_features).length > 0 && (
                    <div className="bg-[#0B0B1A] rounded-lg p-4 border border-[#1E184A]">
                      <h3 className="text-lg font-medium mb-3">
                        Topological Data Analysis Features
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(analysisResults.tda_features).map(([key, value]: [string, any]) => (
                          <div key={key} className="bg-[#0D0E23] p-3 rounded-lg">
                            <h4 className="font-medium text-[#4DE8ED]">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                            <p className="text-white">
                              {Array.isArray(value) 
                                ? value.map((v: any) => typeof v === 'number' ? v.toFixed(4) : v).join(', ')
                                : typeof value === 'number' 
                                  ? value.toFixed(4)
                                  : String(value)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Layer Similarities */}
                  {hasData(analysisResults, 'layer_similarities') && Object.keys(analysisResults.layer_similarities).length > 0 && (
                    <div className="bg-[#0B0B1A] rounded-lg p-4 border border-[#1E184A]">
                      <h3 className="text-lg font-medium mb-3">
                        Layer-wise Concept Similarities
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-400">
                          <thead className="text-xs uppercase bg-[#1E184A] text-gray-200">
                            <tr>
                              <th scope="col" className="px-4 py-2">
                                Layer
                              </th>
                              {Object.keys(analysisResults.layer_similarities).map((concept) => (
                                <th key={concept} scope="col" className="px-4 py-2">
                                  {concept}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {analysisResults.layer_similarities[Object.keys(analysisResults.layer_similarities)[0]]?.map(
                              (_: any, layerIdx: number) => (
                                <tr
                                  key={layerIdx}
                                  className="bg-[#0B0B1A] border-b border-[#1E184A]"
                                >
                                  <td className="px-4 py-2">{layerIdx}</td>
                                  {Object.entries(analysisResults.layer_similarities).map(([concept, values]: [string, any]) => (
                                    <td key={concept} className="px-4 py-2">
                                      {typeof values[layerIdx] === 'number' 
                                        ? values[layerIdx].toFixed(4) 
                                        : 'N/A'}
                                    </td>
                                  ))}
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Bias Analysis Results */}
              {biasAnalysisResult && (
                <div className="bg-[#0B0B1A] rounded-lg p-4 border border-[#1E184A]">
                  <h3 className="text-lg font-medium mb-3">
                    Bias Analysis Results
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hasData(biasAnalysisResult, 'charts.bias_comparison') && (
                      <div>
                        <h4 className="text-md font-medium mb-2">Bias Comparison:</h4>
                        <img
                          src={`data:image/png;base64,${biasAnalysisResult.charts.bias_comparison}`}
                          alt="Bias Comparison"
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                    
                    {hasData(biasAnalysisResult, 'charts.bias_ratio') && (
                      <div>
                        <h4 className="text-md font-medium mb-2">Bias Ratio:</h4>
                        <img
                          src={`data:image/png;base64,${biasAnalysisResult.charts.bias_ratio}`}
                          alt="Bias Ratio"
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-md font-medium mt-4 mb-2">
                    Layer-wise Bias Activations:
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-400">
                      <thead className="text-xs uppercase bg-[#1E184A] text-gray-200">
                        <tr>
                          <th scope="col" className="px-4 py-2">
                            Layer
                          </th>
                          <th scope="col" className="px-4 py-2">
                            {safeGet(biasAnalysisResult, 'selected_biases.0', 'Bias 1')} Activation
                          </th>
                          <th scope="col" className="px-4 py-2">
                            {safeGet(biasAnalysisResult, 'selected_biases.1', 'Bias 2')} Activation
                          </th>
                          <th scope="col" className="px-4 py-2">
                            Ratio
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {hasData(biasAnalysisResult, 'layer_bias_activations') && 
                         biasAnalysisResult.layer_bias_activations.map(
                          (row: any, index: number) => (
                            <tr
                              key={index}
                              className="bg-[#0B0B1A] border-b border-[#1E184A]"
                            >
                              <td className="px-4 py-2">{row.layer}</td>
                              <td className="px-4 py-2">
                                {typeof row.bias1_activation === 'number' 
                                  ? row.bias1_activation.toFixed(4) 
                                  : 'N/A'}
                              </td>
                              <td className="px-4 py-2">
                                {typeof row.bias2_activation === 'number' 
                                  ? row.bias2_activation.toFixed(4) 
                                  : 'N/A'}
                              </td>
                              <td className="px-4 py-2">
                                {typeof row.ratio === 'number' 
                                  ? row.ratio.toFixed(4) 
                                  : 'N/A'}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 p-3 bg-[#0D0E23] rounded-lg">
                    <h4 className="text-md font-medium mb-2">Summary:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <p className="text-gray-300">
                        <span className="text-gray-400">Bias 1 Avg:</span>{' '}
                        {typeof safeGet(biasAnalysisResult, 'summary.bias1_avg') === 'number' 
                          ? biasAnalysisResult.summary.bias1_avg.toFixed(4) 
                          : 'N/A'}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Bias 2 Avg:</span>{' '}
                        {typeof safeGet(biasAnalysisResult, 'summary.bias2_avg') === 'number' 
                          ? biasAnalysisResult.summary.bias2_avg.toFixed(4) 
                          : 'N/A'}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Ratio Avg:</span>{' '}
                        {typeof safeGet(biasAnalysisResult, 'summary.ratio_avg') === 'number' 
                          ? biasAnalysisResult.summary.ratio_avg.toFixed(4) 
                          : 'N/A'}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Max Bias Layer:</span>{' '}
                        {safeGet(biasAnalysisResult, 'summary.max_bias_layer', 'N/A')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Bias Analysis Recommendations */}
                  {hasData(biasAnalysisResult, 'recommendations') && biasAnalysisResult.recommendations.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium mb-2">Bias-Specific Recommendations:</h4>
                      <div className="space-y-3">
                        {biasAnalysisResult.recommendations.map((rec: any, index: number) => (
                          <div key={index} className="p-3 bg-[#0D0E23] rounded-lg border border-[#1E184A]">
                            <h3 className="text-lg font-medium text-[#FFD700]">
                              {typeof rec.title === 'string' ? rec.title : 'Recommendation'}
                            </h3>

                            <p className="text-gray-300 mt-1">{rec.description || 'No description available'}</p>
                            {rec.priority && (
                              <p className="text-xs text-gray-500 mt-1">Priority: {rec.priority}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bias Scoring Results */}
              {biasScoringResult && (
                <div className="bg-[#0B0B1A] rounded-lg p-4 border border-[#1E184A]">
                  <h3 className="text-lg font-medium mb-3">
                    Bias Scoring Results
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hasData(biasScoringResult, 'charts.bias_scores') && (
                      <div>
                        <h4 className="text-md font-medium mb-2">Bias Scores:</h4>
                        <img
                          src={`data:image/png;base64,${biasScoringResult.charts.bias_scores}`}
                          alt="Bias Scoring Chart"
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                    
                    {hasData(biasScoringResult, 'charts.detailed_bias') && (
                      <div>
                        <h4 className="text-md font-medium mb-2">Detailed Bias by Group:</h4>
                        <img
                          src={`data:image/png;base64,${biasScoringResult.charts.detailed_bias}`}
                          alt="Detailed Bias Chart"
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-md font-medium mt-4 mb-2">
                    Scores per Concept:
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-400">
                      <thead className="text-xs uppercase bg-[#1E184A] text-gray-200">
                        <tr>
                          <th scope="col" className="px-4 py-2">
                            Concept
                          </th>
                          <th scope="col" className="px-4 py-2">
                            Bias Score
                          </th>
                          <th scope="col" className="px-4 py-2">
                            Normalized Score
                          </th>
                          <th scope="col" className="px-4 py-2">
                            Group 0 Mean
                          </th>
                          <th scope="col" className="px-4 py-2">
                            Group 1 Mean
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {hasData(biasScoringResult, 'bias_scores_detailed') && 
                         biasScoringResult.bias_scores_detailed.map(
                          (score: any, index: number) => (
                            <tr
                              key={index}
                              className="bg-[#0B0B1A] border-b border-[#1E184A]"
                            >
                              <td className="px-4 py-2">{score.concept || 'N/A'}</td>
                              <td className="px-4 py-2">
                                {typeof score.bias_score === 'number' 
                                  ? score.bias_score.toFixed(4) 
                                  : 'N/A'}
                              </td>
                              <td className="px-4 py-2">
                                {typeof safeGet(biasScoringResult, `normalized_scores.${score.concept}`) === 'number' 
                                  ? biasScoringResult.normalized_scores[score.concept].toFixed(4) 
                                  : 'N/A'}
                              </td>
                              <td className="px-4 py-2">
                                {typeof score.group_0_mean === 'number' 
                                  ? score.group_0_mean.toFixed(4) 
                                  : 'N/A'}
                              </td>
                              <td className="px-4 py-2">
                                {typeof score.group_1_mean === 'number' 
                                  ? score.group_1_mean.toFixed(4) 
                                  : 'N/A'}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Bias Metrics */}
                  {hasData(biasScoringResult, 'bias_metrics') && Object.keys(biasScoringResult.bias_metrics).length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium mb-2">Bias Quantification Metrics:</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-400">
                          <thead className="text-xs uppercase bg-[#1E184A] text-gray-200">
                            <tr>
                              <th scope="col" className="px-4 py-2">
                                Concept
                              </th>
                              <th scope="col" className="px-4 py-2">
                                Absolute Difference
                              </th>
                              <th scope="col" className="px-4 py-2">
                                Relative Difference
                              </th>
                              <th scope="col" className="px-4 py-2">
                                Log Ratio
                              </th>
                              <th scope="col" className="px-4 py-2">
                                Statistical Parity
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(biasScoringResult.bias_metrics).map(
                              ([concept, metrics]: [string, any], index: number) => (
                                <tr
                                  key={index}
                                  className="bg-[#0B0B1A] border-b border-[#1E184A]"
                                >
                                  <td className="px-4 py-2">{concept}</td>
                                  <td className="px-4 py-2">
                                    {typeof metrics.absolute_difference === 'number' 
                                      ? metrics.absolute_difference.toFixed(4) 
                                      : 'N/A'}
                                  </td>
                                  <td className="px-4 py-2">
                                    {typeof metrics.relative_difference === 'number' 
                                      ? metrics.relative_difference.toFixed(4) 
                                      : 'N/A'}
                                  </td>
                                  <td className="px-4 py-2">
                                    {typeof metrics.log_ratio === 'number' 
                                      ? metrics.log_ratio.toFixed(4) 
                                      : 'N/A'}
                                  </td>
                                  <td className="px-4 py-2">
                                    {typeof metrics.statistical_parity === 'number' 
                                      ? metrics.statistical_parity.toFixed(4) 
                                      : 'N/A'}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 p-3 bg-[#0D0E23] rounded-lg">
                    <h4 className="text-md font-medium mb-2">Summary:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <p className="text-gray-300">
                        <span className="text-gray-400">Max Bias Score:</span>{' '}
                        {typeof safeGet(biasScoringResult, 'summary.max_bias_score') === 'number' 
                          ? biasScoringResult.summary.max_bias_score.toFixed(4) 
                          : 'N/A'}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Avg Bias Score:</span>{' '}
                        {typeof safeGet(biasScoringResult, 'summary.avg_bias_score') === 'number' 
                          ? biasScoringResult.summary.avg_bias_score.toFixed(4) 
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Bias Scoring Recommendations */}
                  {hasData(biasScoringResult, 'recommendations') && biasScoringResult.recommendations.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium mb-2">Bias Scoring Recommendations:</h4>
                      <div className="space-y-3">
                        {biasScoringResult.recommendations.map((rec: any, index: number) => (
                          <div key={index} className="p-3 bg-[#0D0E23] rounded-lg border border-[#1E184A]">
                            <h5 className="font-medium text-[#FFD700]">{rec.title || 'Recommendation'}</h5>
                            <p className="text-gray-300 mt-1">{rec.description || 'No description available'}</p>
                            {rec.priority && (
                              <p className="text-xs text-gray-500 mt-1">Priority: {rec.priority}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recommendations Section */}
        <div className="bg-[#0D0E23]/60 rounded-xl p-6 border border-[#1E184A] mt-6">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('recommendations')}
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-[#FFD700]" />
              Recommendations for Next Steps
            </h2>
            {expandedSections.recommendations ? <ChevronUp /> : <ChevronDown />}
          </div>

          {expandedSections.recommendations && (
            <div className="mt-4 space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="bg-[#0B0B1A] rounded-lg p-3 border border-[#1E184A]"
                  >
                    <h3 className="text-lg font-medium text-[#FFD700]">
                      {rec.title || 'Recommendation'}
                    </h3>
                    <p
                      className="text-gray-300 mt-1"
                      dangerouslySetInnerHTML={{
                        __html: typeof rec.description === 'string' ? rec.description : 'Invalid description'
                      }}
                      
                    ></p>
                    {hasData(rec, 'details') && rec.details.length > 0 && (
                      <ul className="list-disc list-inside text-gray-400 mt-2">
                        {rec.details.map((detail: any, dIndex: number) => (
                          <li key={dIndex}>
                            <strong>{detail.concept || 'Concept'}:</strong>{' '}
                            {Array.isArray(detail.related_concepts) 
                              ? detail.related_concepts.join(', ') 
                              : detail.related_concepts || 'None'}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Priority: {rec.priority || 'Medium'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                 <h1>nothing</h1>
                </p>  
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzePage;
