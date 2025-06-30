import React, { useState } from 'react';
import { FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ModelDetailsPopup = ({ setShowModel, modelData, datasetsData, username, modeldetails, trainingSubmition }) => {
  const [showConfirmDeleteModel, setShowConfirmDeleteModel] = useState(false);
  const [showConfirmDeleteDataset, setShowConfirmDeleteDataset] = useState(false);
  const [isDeletingModel, setIsDeletingModel] = useState(false);
  const [isDeletingDataset, setIsDeletingDataset] = useState(false);
  const BACKEND_URL = process.env.BACKEND_URL;

  const modelDatas = {
    modelName: modeldetails.model_name,
    createdAt: datasetsData.created_at,
    numTrainImages: datasetsData.train_img,
    numTestImages: datasetsData.test_img,
    datasets: [{
      name: datasetsData.deleted ? "Deleted" : datasetsData.dataset_name,
      details: datasetsData.deleted ? 'Dataset Not Found' : `Test Images: ${datasetsData.test_img}, Train Images: ${datasetsData.train_img}`
    }],
    segmentationImages: 60,
    numTimesUsed: 10,
    details: {
      imageSize: `${trainingSubmition.image_size} x ${trainingSubmition.image_size}`,
      epoch: 50,
      workers: 16,
      batchSize: trainingSubmition.batch_size,
      seed: trainingSubmition.seed,
    },
  };

  const handleDeleteModel = async () => {
    setIsDeletingModel(true);
    try {
      const response = await fetch(`${BACKEND_URL}/train/deleteModel/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          modelname: modeldetails.model_name,
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert('Model deleted successfully!');
        setShowModel(false);
      } else {
        alert('Failed to delete the model.');
      }
    } catch (error) {
      console.error('Error deleting model:', error);
    } finally {
      setIsDeletingModel(false);
    }
  };

  const handleDeleteDataset = async () => {
    setIsDeletingDataset(true);
    try {
      const response = await fetch(`${BACKEND_URL}/train/deleteDataset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          datasetname: modelDatas.datasets[0].name,
          modelname: modeldetails.model_name,
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert('Dataset deleted successfully!');
        setShowModel(false);
      } else {
        alert('Failed to delete the dataset.');
      }
    } catch (error) {
      console.error('Error deleting dataset:', error);
    } finally {
      setIsDeletingDataset(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-br dark:from-black dark:via-neutral-900 dark:to-neutral-950 bg-black bg-opacity-80">
      {/* Animated Frosted Glass Background */}
      <div className="w-full max-w-3xl p-8 rounded-xl z-100 shadow-2xl bg-gradient-to-r from-blue-900 via-purple-900 to-black bg-opacity-80 backdrop-blur-lg relative overflow-hidden transition-all transform hover:scale-105 duration-500 ease-in-out border border-blue-800">

        {/* Glowing Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-cyan-400 tracking-wide neon-text transition-all duration-300 ease-in-out hover:text-cyan-500">
            {modeldetails.model_name}
          </h1>
          <button className="text-neutral-400 hover:text-neutral-200 transition duration-300" onClick={() => setShowModel(false)}>
            <FaTimesCircle size={28} className="hover:text-red-500" />
          </button>
        </div>

        {/* Glowing Waves Separator */}
        <div className="wave-separator mb-6">
          <div className="relative w-full h-2 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full animate-pulse"></div>
        </div>

        {/* Model Info Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-800 bg-opacity-60 p-6 rounded-lg shadow-lg border border-neutral-700 hover:bg-opacity-80 transition-all duration-300 ease-in-out hover:shadow-teal-500/50">
            <h2 className="text-xl font-semibold text-teal-300 mb-4">Model Details</h2>
            <div className="text-sm text-neutral-300 space-y-2">
              <p><strong>Model Name:</strong> {modeldetails.model_name}</p>
              <p><strong>Train Images:</strong> {modelDatas.numTrainImages}</p>
              {/* <p><strong>Test Images:</strong> {modelDatas.numTestImages}</p> */}
              <p><strong>Image Size:</strong> {trainingSubmition.image_size} x {trainingSubmition.image_size}</p>
              <p><strong>Batch Size:</strong> {trainingSubmition.batch_size}</p>
              <p><strong>Seed:</strong> {trainingSubmition.seed}</p>
            </div>
            <div className="flex justify-end">
              <button
                className="px-6 py-3 bg-gradient-to-br h-10 mt-6 from-red-600 to-red-500 text-white font-bold rounded-full hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg flex items-center"
                onClick={() => setShowConfirmDeleteModel(true)}
              >
                <FaTrash className="mr-2" />
                Delete Model
              </button>
            </div>
          </div>

          {/* Dataset Info Box */}
          <div className="relative bg-neutral-800 bg-opacity-60 p-8 rounded-lg shadow-lg border border-neutral-700 hover:bg-opacity-80 transition-all duration-500 ease-in-out hover:shadow-purple-500/50">
            <h2 className="text-2xl font-semibold text-teal-300 mb-4">Datasets</h2>
            {datasetsData.deleted ? (
              <div className="text-sm text-neutral-300">
                <p className="font-semibold text-red-400">Dataset Not Found It's seem like you have already deleted the dataset</p>
              </div>
            ) : (
              <div className="text-sm text-neutral-300 space-y-2">
                <p><strong>{datasetsData.dataset_name}:</strong></p>
                <ul className="list-decimal list-inside pl-4">
                  <li><strong>Train Images:</strong> {datasetsData.train_img}</li>
                  {/* <li><strong>Test Images:</strong> {datasetsData.test_img}</li> */}
                </ul>
              </div>
            )}

            {/* Floating Delete Dataset Button inside Dataset Box */}
            <div className="mt-6 bottom-0 h-full flex  justify-end">
              
              <button
              
                className={`px-5 py-3 h-10 ${datasetsData.deleted ? "mt-28 cursor-not-allowed scale-100 hidden " : " mt-20 hover:scale-110 hover:shadow-red-500"} bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-full shadow-lg transform  transition-all duration-500 flex items-center`}
                onClick={() => setShowConfirmDeleteDataset(true)}
                disabled={datasetsData.deleted}
              >
                <FaTrash className="mr-2" />
                Delete Dataset
              </button>
            </div>
          </div>
        </div>

        {/* Confirm Delete Model Modal */}
        {showConfirmDeleteModel && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-80">
            <div className="bg-gradient-to-br from-red-500 to-red-700 p-6 rounded-lg shadow-2xl border border-red-800 animate-fade-in">
              <h3 className="text-white mb-4 flex items-center">
                <FaCheckCircle className="mr-2 text-green-300 animate-pulse" />
                Are you sure you want to delete this model?
              </h3>
              <div className="flex justify-end space-x-2">

                
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all duration-300"
                  onClick={handleDeleteModel}
                  disabled={isDeletingModel}
                >
                  {isDeletingModel ? 'Deleting...' : 'Yes'}
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-300"
                  onClick={() => setShowConfirmDeleteModel(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Delete Dataset Modal */}
        {showConfirmDeleteDataset && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-80">
            <div className="bg-gradient-to-br from-red-500 to-red-700 p-6 rounded-lg shadow-2xl border border-red-800 animate-fade-in">
              <h3 className="text-white mb-4 flex items-center">
                <FaCheckCircle className="mr-2 text-green-300 animate-pulse" />
                Are you sure you want to delete this dataset?
              </h3>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all duration-300"
                  onClick={handleDeleteDataset}
                  disabled={isDeletingDataset}
                >
                  {isDeletingDataset ? 'Deleting...' : 'Yes'}
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-300"
                  onClick={() => setShowConfirmDeleteDataset(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelDetailsPopup;
