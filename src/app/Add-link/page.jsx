"use client";
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSavedData as setSavedDataAction, addSavedData } from '@/app/redux/savedDataSlice'; // Renaming import for clarity
import Navbar from '@/app/components/Navbar';
import Image from 'next/image';
import Phone from '@/app/Add-link/phone.png';
import Started from '@/app/Add-link/started.png';
import GithubPic from '@/app/Add-link/githubpics.png';
import YoutubePic from '@/app/Add-link/youtubepics.png';
import LinkedInPic from '@/app/Add-link/linkedInpics.png';
import CustomSelect from '@/app/components/CustomSelect';
import { firestore } from '@/app/Create-account/auth';
import { collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore";

function Page() {
  const dispatch = useDispatch();
  const [forms, setForms] = useState([{ platform: '', link: '' }]);
  const [showForm, setShowForm] = useState(false);
  const [savedData, setSavedDataState] = useState([]); // Renaming the state function
  const [newLinkSaved, setNewLinkSaved] = useState(false);

  useEffect(() => {
    if (!newLinkSaved) {
      fetchSavedData();
    }
  }, [newLinkSaved]);

  const fetchSavedData = async () => {
    try {
      const q = query(collection(firestore, "links"), orderBy("timestamp", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map(doc => doc.data());
      console.log("Fetched data:", fetchedData);
      setSavedDataState(fetchedData.reverse());
      dispatch(setSavedDataAction(fetchedData.reverse())); // Dispatching the action
    } catch (error) {
      console.error('Error fetching saved data:', error);
    }
  };

  const addForm = () => {
    if (!showForm) {
      setShowForm(true);
    } else {
      setForms([...forms, { platform: '', link: '' }]);
    }
  };

  const removeForm = (index) => {
    const updatedForms = forms.filter((_, i) => i !== index);
    setForms(updatedForms);
    if (updatedForms.length === 0) {
      setShowForm(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    const newForms = [...forms];
    newForms[index][field] = value;
    setForms(newForms);
  };

  const handleSave = async () => {
    try {
      const newLinks = forms.map((form) => ({
        ...form,
        timestamp: new Date(),
      }));
      for (let link of newLinks) {
        await addDoc(collection(firestore, "links"), link);
        dispatch(addSavedData(link)); // Dispatching the action
      }
      setNewLinkSaved(true);
      const updatedData = [...savedData, ...newLinks].slice(-5).reverse();
      setSavedDataState(updatedData);
      dispatch(setSavedDataAction(updatedData)); // Dispatching the action
      console.log('Links saved:', newLinks);
    } catch (error) {
      console.error('Error saving links:', error);
    }
  };

  const allFormsFilled = forms.every(form => form.platform && form.link);

  const getImageForPlatform = (platform) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return GithubPic;
      case 'youtube':
        return YoutubePic;
      case 'linkedin':
        return LinkedInPic;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />

      <div className="px-4 mt-0 bg-[#fafafa]">
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* First Container */}
          <div className="hidden lg:flex bg-white p-6 rounded-lg shadow-md flex-grow basis-14 items-center justify-center relative">
            <div className="relative w-64 h-128">
              <Image src={Phone} alt="Phone Image" />
              {newLinkSaved && savedData.length > 0 && (
                <div className="absolute top-56 left-0 right-0 flex flex-wrap items-center space-y-4 justify-center">
                  {savedData.map((data, index) => (
                    <div key={index} className="m-2">
                      {data.platform && (
                        <img
                          src={getImageForPlatform(data.platform)?.src}
                          alt={`${data.platform} Image`}
                          className="max-w-full h-9"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Second Container */}
          <div className="bg-white p-6 rounded-lg shadow-md flex-grow basis-48 md:h-[2000px] lg:h-auto">
            <h2 className="text-2xl font-bold mb-2">Customize your links</h2>
            <p className="mb-4">Add/edit/remove links below and share all your profiles with the world!</p>
            <div className='flex items-center justify-center'>
              <button
                className="bg-white text-[#633CFF] border border-[#633CFF] px-24 py-2 md:px-64 md:py-3 rounded mb-4 whitespace-nowrap"
                onClick={addForm}
              >
                + Add new link
              </button>
            </div>
            {showForm ? (
              forms.map((form, index) => (
                <div key={index} className='bg-[#fafafa] p-8 mb-4'>
                  <div className='flex justify-between items-center mb-4'>
                    <span>link#{index + 1}</span>
                    <button onClick={() => removeForm(index)}>remove</button>
                  </div>
                  <form>
                    <div className="mb-4">
                      <label htmlFor={`platform-${index}`} className="block text-gray-700">Platform</label>
                      <CustomSelect
                        value={form.platform}
                        onChange={(value) => handleInputChange(index, 'platform', value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor={`link-${index}`} className="block text-gray-700">Link</label>
                      <input
                        type="text"
                        id={`link-${index}`}
                        value={form.link}
                        onChange={(e) => handleInputChange(index, 'link', e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#633bff] focus:shadow-[0_0_0_4px_rgba(99,59,255,0.15)]"
                      />
                    </div>
                  </form>
                </div>
              ))
            ) : (
              <div className='bg-[#fafafa] p-8'>
                <div className='flex items-center justify-center'>
                  <Image src={Started} alt="Another Image" width={300} height={200} className="mb-4" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Let's get you started</h3>
                <p className="mb-4 text-center">Use the "Add new link" button to get started. Once you have more than one link, you can reorder and edit them. We're here to help you share your profiles with everyone!</p>
              </div>
            )}
            {showForm && (
              <button
                className={`bg-[#633CFF] text-white px-4 py-2 md:px-8 md:py-3 rounded mt-4 float-right ${allFormsFilled ? '' : 'opacity-50 cursor-not-allowed'}`}
                onClick={handleSave}
                disabled={!allFormsFilled}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
